import 'dotenv/config';
import {
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActiveEntry } from './dto/entry-response.dto';

@Injectable()
export class EntryRepository {
  constructor(private prisma: PrismaService) {}

  async findByToken(token: string) {
    return this.prisma.entry.findUnique({
      where: { token },
      include: { queue: { select: { name: true, isOpen: true } } },
    });
  }

  async findFirst(where: any) {
    return this.prisma.entry.findFirst({ where });
  }

  async create(data: any) {
    return this.prisma.entry.create({ data, include: { queue: { select: { name: true } } } });
  }

  async update(where: any, data: any) {
    return this.prisma.entry.update({ where, data });
  }

  async count(where: any): Promise<number> {
    return this.prisma.entry.count({ where });
  }

  async findActive(queueId: string): Promise<ActiveEntry[]> {
    return this.prisma.entry.findMany({
      where: {
        queueId,
        status: { in: ['WAITING', 'NOTIFIED', 'SERVING', 'CALLED'] },
      },
      orderBy: { position: 'asc' },
      select: {
        id: true, name: true, position: true,
        status: true, token: true, email: true,
      },
    });
  }

  async findCompleted(queueId: string, take: number) {
    return this.prisma.entry.findMany({
      where: {
        queueId, status: 'DONE',
        servedAt: { not: null },
        completedAt: { not: null },
      },
      orderBy: { completedAt: 'desc' },
      take,
    });
  }
  async findLastInQueue(queueId: string) {
  return this.prisma.entry.findFirst({
    where: { queueId },
    orderBy: { position: 'desc' },
  });
}

async countAhead(queueId: string, position: number): Promise<number> {
  return this.prisma.entry.count({
    where: {
      queueId,
      position: { lt: position },
      status: { in: ['WAITING', 'NOTIFIED'] },
    },
  });
}

async findByStatus(queueId: string, status: string) {
  return this.prisma.entry.findFirst({
    where: { queueId, status: status as any },
    orderBy: { position: 'asc' },
  });
}

async findNextWaiting(queueId: string) {
  return this.prisma.entry.findFirst({
    where: { queueId, status: { in: ['WAITING', 'NOTIFIED'] } },
    orderBy: { position: 'asc' },
  });
}

async findSecondWaiting(queueId: string, excludeId: string) {
  return this.prisma.entry.findFirst({
    where: {
      queueId,
      status: { in: ['WAITING', 'NOTIFIED'] },
      id: { not: excludeId },
    },
    orderBy: { position: 'asc' },
  });
}

async findByIdAndAdmin(entryId: string, adminId: string) {
  return this.prisma.entry.findFirst({
    where: { id: entryId, queue: { adminId } },
  });
}

async updateById(id: string, data: any) {
  return this.prisma.entry.update({ where: { id }, data });
}

async updateByToken(token: string, data: any) {
  return this.prisma.entry.update({ where: { token }, data });
}
findOpenById(queueId: string) {}
  
}