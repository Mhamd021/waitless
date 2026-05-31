import 'dotenv/config';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JoinQueueDto } from './dto/join-queue.dto';
import { QueueGateway } from '../gateway/queue.gateway';
import { Entry } from '../../generated/prisma/client';
import { JoinQueueResponse, EntryStatusResponse } from './dto/entry-response.dto';
import { EntryRepository } from './entries.repository';
import { QueueRepository } from '../queues/queue.repository';

@Injectable()
export class EntriesService {
  constructor(
    private entryRepo: EntryRepository,
    private queueRepo: QueueRepository,
    @InjectQueue('notifications') private notifQueue: Queue,
    private gateway: QueueGateway,
  ) {}

  async join(queueId: string, dto: JoinQueueDto): Promise<JoinQueueResponse> {
    const queue = await this.queueRepo.findOpenById(queueId);
    if (!queue) throw new NotFoundException('Queue not found or closed');

    const lastEntry = await this.entryRepo.findLastInQueue(queueId);
    const nextPosition = lastEntry ? lastEntry.position + 1 : 1;

    const entry = await this.entryRepo.create({
      name: dto.name,
      email: dto.email,
      position: nextPosition,
      queueId,
    });

    const entries = await this.entryRepo.findActive(queueId);
    this.gateway.notifyQueueUpdate(queueId, { type: 'next-called', entries });

    return {
      id: entry.id,
      name: entry.name,
      position: nextPosition,
      token: entry.token,
      queueName: queue.name,
      trackingUrl: `http://localhost:3000/track/${entry.token}`,
    };
  }

  async getStatus(token: string): Promise<EntryStatusResponse> {
    const entry = await this.entryRepo.findByToken(token);
    if (!entry) throw new NotFoundException('Entry not found');

    const ahead = await this.entryRepo.countAhead(
      entry.queueId,
      entry.position,
    );
    const avgServiceTime = await this.getEstimatedWait(entry.queueId);

    return {
      name: entry.name,
      position: entry.position,
      status: entry.status,
      ahead,
      queueName: entry.queue.name,
      isQueueOpen: entry.queue.isOpen,
      queueId: entry.queueId,
      estimatedWaitMinutes: ahead * avgServiceTime,
      avgServiceTimeMinutes: avgServiceTime,
    };
  }

  async callNext(queueId: string, adminId: string): Promise<Entry> {
    const queue = await this.queueRepo.findByIdAndAdmin(queueId, adminId);
    if (!queue) throw new NotFoundException('Queue not found');

    // أنهِ الزبون الحالي
    const currentlyServing = await this.entryRepo.findByStatus(queueId, 'SERVING');
    if (currentlyServing) {
      await this.entryRepo.updateById(currentlyServing.id, {
        status: 'DONE',
        completedAt: new Date(),
      });
    }

    // الزبون التالي
    const next = await this.entryRepo.findNextWaiting(queueId);
    if (!next) throw new BadRequestException('Queue is empty');

    const updated = await this.entryRepo.updateById(next.id, {
      status: 'CALLED',
    });

    // إشعار الزبون الحالي
    if (next.email) {
      await this.notifQueue.add('your-turn-now', {
        email: next.email,
        name: next.name,
        queueName: queue.name,
      });
    }

    // إشعار رقم 2
    const secondInLine = await this.entryRepo.findSecondWaiting(queueId, next.id);
    if (secondInLine?.email) {
      await this.notifQueue.add('your-turn-soon', {
        email: secondInLine.email,
        name: secondInLine.name,
        position: 2,
        queueName: queue.name,
        trackingUrl: `http://localhost:3000/track/${secondInLine.token}`,
      }, { delay: 30_000 });
    }

    const entries = await this.entryRepo.findActive(queueId);
    this.gateway.notifyQueueUpdate(queueId, { type: 'next-called', entries });

    return updated;
  }

  async complete(entryId: string, adminId: string): Promise<Entry> {
    const entry = await this.entryRepo.findByIdAndAdmin(entryId, adminId);
    if (!entry) throw new NotFoundException('Entry not found');

    const updated = await this.entryRepo.updateById(entryId, {
      status: 'DONE',
      completedAt: new Date(),
    });

    const entries = await this.entryRepo.findActive(entry.queueId);
    this.gateway.notifyQueueUpdate(entry.queueId, { type: 'next-called', entries });

    return updated;
  }

  async leave(token: string): Promise<Entry> {
    const entry = await this.entryRepo.findByToken(token);
    if (!entry) throw new NotFoundException('Entry not found');
    if (entry.status === 'DONE' || entry.status === 'LEFT') {
      throw new BadRequestException('Already done or left');
    }

    const updated = await this.entryRepo.updateByToken(token, { status: 'LEFT' });

    const entries = await this.entryRepo.findActive(entry.queueId);
    this.gateway.notifyQueueUpdate(entry.queueId, { type: 'entry-left', entries });

    return updated;
  }

  async findAll(queueId: string, adminId: string) {
    const queue = await this.queueRepo.findByIdAndAdmin(queueId, adminId);
    if (!queue) throw new NotFoundException('Queue not found');
    return this.entryRepo.findActive(queueId);
  }

  async confirmArrival(queueId: string, adminId: string): Promise<Entry> {
    const queue = await this.queueRepo.findByIdAndAdmin(queueId, adminId);
    if (!queue) throw new NotFoundException('Queue not found');

    const called = await this.entryRepo.findByStatus(queueId, 'CALLED');
    if (!called) throw new BadRequestException('No called customer');

    const updated = await this.entryRepo.updateById(called.id, {
      status: 'SERVING',
      servedAt: new Date(),
    });

    const entries = await this.entryRepo.findActive(queueId);
    this.gateway.notifyQueueUpdate(queueId, { type: 'next-called', entries });

    return updated;
  }

  async markNoShow(queueId: string, adminId: string): Promise<Entry> {
    const queue = await this.queueRepo.findByIdAndAdmin(queueId, adminId);
    if (!queue) throw new NotFoundException('Queue not found');

    const called = await this.entryRepo.findByStatus(queueId, 'CALLED');
    if (!called) throw new BadRequestException('No called customer');

    await this.entryRepo.updateById(called.id, { status: 'NO_SHOW' });

    return this.callNext(queueId, adminId);
  }

  private async getEstimatedWait(queueId: string): Promise<number> {
    const completed = await this.entryRepo.findCompleted(queueId, 5);
    if (completed.length === 0) return 0;

    const avgMinutes = completed.reduce((sum, entry) => {
      const diff = entry.completedAt!.getTime() - entry.servedAt!.getTime();
      return sum + diff / 60000;
    }, 0) / completed.length;

    return Math.round(avgMinutes);
  }
}