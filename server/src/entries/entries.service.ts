import 'dotenv/config';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { JoinQueueDto } from './dto/join-queue.dto';
import { QueueGateway } from '../gateway/queue.gateway';
import { Entry } from '../../generated/prisma/client';

@Injectable()
export class EntriesService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notifQueue: Queue,
    private gateway: QueueGateway, 
  ) {}

  async join(queueId: string, dto: JoinQueueDto) {
    const queue = await this.prisma.queue.findFirst({
      where: { id: queueId, isOpen: true },
    });
    if (!queue) throw new NotFoundException('Queue not found or closed');

    const lastEntry = await this.prisma.entry.findFirst({
      where: { queueId },
      orderBy: { position: 'desc' },
    });
    const nextPosition = lastEntry ? lastEntry.position + 1 : 1;

    const entry = await this.prisma.entry.create({
      data: {
        name: dto.name,
        email: dto.email,
        position: nextPosition,
        queueId,
      },
      include: { queue: { select: { name: true } } },
    });

    const entries = await this.getActiveEntries(queueId);
    this.gateway.notifyQueueUpdate(queueId, {
      type: 'next-called',
      entries,
    });

    return {
      id: entry.id,
      name: entry.name,
      position: nextPosition,
      token: entry.token,
      queueName: entry.queue.name,
      trackingUrl: `http://localhost:3001/track/${entry.token}`,
    };
  }

  async getStatus(token: string) {
    const entry = await this.prisma.entry.findUnique({
      where: { token },
      include: { queue: { select: { name: true, isOpen: true } } },
    });
    if (!entry) throw new NotFoundException('Entry not found');

    const ahead = await this.prisma.entry.count({
      where: {
        queueId: entry.queueId,
        position: { lt: entry.position },
        status: { in: ['WAITING', 'NOTIFIED'] },
      },
    });
    const avgServiceTime = await this.getEstimatedWait(entry.queueId);
    const estimatedWaitMinutes = ahead * avgServiceTime;
    return {
      name: entry.name,
      position: entry.position,
      status: entry.status,
      ahead,
      queueName: entry.queue.name,
      isQueueOpen: entry.queue.isOpen,
      queueId: entry.queueId,
      estimatedWaitMinutes,
    avgServiceTimeMinutes: avgServiceTime,
    };
  }

  async callNext(queueId: string, adminId: string): Promise<Entry> {
  const queue = await this.prisma.queue.findFirst({
    where: { id: queueId, adminId },
  });
  if (!queue) throw new NotFoundException('Queue not found');

  const currentlyServing = await this.prisma.entry.findFirst({
    where: { queueId, status: 'SERVING' },
  });
  if (currentlyServing) {
    await this.prisma.entry.update({
      where: { id: currentlyServing.id },
      data: { status: 'DONE', completedAt: new Date() },
    });
  }

  const next = await this.prisma.entry.findFirst({
    where: { 
      queueId, 
      status: { in: ['WAITING', 'NOTIFIED'] } 
    },
    orderBy: { position: 'asc' },
  });
  if (!next) throw new BadRequestException('Queue is empty');

  const updated = await this.prisma.entry.update({
    where: { id: next.id },
    data: { status: 'CALLED' },
  });

  if (next.email) {
    await this.notifQueue.add('your-turn-now', {
      email: next.email,
      name: next.name,
      queueName: queue.name,
    });
  }

  const secondInLine = await this.prisma.entry.findFirst({
    where: { 
      queueId, 
      status: { in: ['WAITING', 'NOTIFIED'] },
      id: { not: next.id },
    },
    orderBy: { position: 'asc' },
  });

  if (secondInLine?.email) {
    await this.notifQueue.add('your-turn-soon', {
      email: secondInLine.email,
      name: secondInLine.name,
      position: 2,
      queueName: queue.name,
      trackingUrl: `http://localhost:3000/track/${secondInLine.token}`,
    }, { delay: 30_000 });
  }

  const entries = await this.getActiveEntries(queueId);
  this.gateway.notifyQueueUpdate(queueId, {
    type: 'next-called',
    entries,
  });

  return updated;
}

  async complete(entryId: string, adminId: string) {
    const entry = await this.prisma.entry.findFirst({
      where: { id: entryId, queue: { adminId } },
    });
    if (!entry) throw new NotFoundException('Entry not found');

    const updated = await this.prisma.entry.update({
      where: { id: entryId },
      data: { status: 'DONE',completedAt: new Date() },
    });

    const entries = await this.getActiveEntries(entry.queueId);
    this.gateway.notifyQueueUpdate(entry.queueId, {
      type: 'next-called',
      entries,
    });

    return updated;
  }

  async leave(token: string) {
    const entry = await this.prisma.entry.findUnique({
      where: { token },
    });
    if (!entry) throw new NotFoundException('Entry not found');
    if (entry.status === 'DONE' || entry.status === 'LEFT') {
      throw new BadRequestException('Already done or left');
    }

    const updated = await this.prisma.entry.update({
      where: { token },
      data: { status: 'LEFT' },
    });

    const entries = await this.getActiveEntries(entry.queueId);
    this.gateway.notifyQueueUpdate(entry.queueId, {
      type: 'entry-left',
      entries,
    });

    return updated;
  }

  async findAll(queueId: string, adminId: string) {
    const queue = await this.prisma.queue.findFirst({
      where: { id: queueId, adminId },
    });
    if (!queue) throw new NotFoundException('Queue not found');

    return this.getActiveEntries(queueId);
  }

  private async getActiveEntries(queueId: string) {
    return this.prisma.entry.findMany({
      where: {
        queueId,
        status: { in: ['WAITING', 'NOTIFIED', 'SERVING','CALLED'] },
      },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
        token: true,
        email:true,
      },
    });
  }

  async getEstimatedWait(queueId: string): Promise<number> 
  {
    const completed = await this.prisma.entry.findMany({
      where:{ queueId,status:'DONE',servedAt:{not:null} , completedAt:{not:null} 
      
    },
    orderBy:{completedAt:'desc'},
    take:5
    });
    if(completed.length===0) return 0;

      const avgMinutes = completed.reduce((sum, entry) => {
    const diff = entry.completedAt!.getTime() 
               - entry.servedAt!.getTime();
    return sum + diff / 60000;  
  }, 0) / completed.length;

    return Math.round(avgMinutes);
  }

  
async confirmArrival(queueId: string, adminId: string) {
  const queue = await this.prisma.queue.findFirst({
    where: { id: queueId, adminId },
  });
  if (!queue) throw new NotFoundException('Queue not found');

  const called = await this.prisma.entry.findFirst({
    where: { queueId, status: 'CALLED' },
    orderBy: { position: 'asc' },
  });
  if (!called) throw new BadRequestException('No called customer');

  const updated = await this.prisma.entry.update({
    where: { id: called.id },
    data: { status: 'SERVING', servedAt: new Date() },
  });

  const entries = await this.getActiveEntries(queueId);
  this.gateway.notifyQueueUpdate(queueId, {
    type: 'next-called',
    entries,
  });

  return updated;
}

async markNoShow(queueId: string, adminId: string) {
  const queue = await this.prisma.queue.findFirst({
    where: { id: queueId, adminId },
  });
  if (!queue) throw new NotFoundException('Queue not found');

  const called = await this.prisma.entry.findFirst({
    where: { queueId, status: 'CALLED' },
    orderBy: { position: 'asc' },
  });
  if (!called) throw new BadRequestException('No called customer');

  await this.prisma.entry.update({
    where: { id: called.id },
    data: { status: 'NO_SHOW' },
  });

  return this.callNext(queueId, adminId);
}


}