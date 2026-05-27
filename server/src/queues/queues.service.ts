import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import * as QRCode from 'qrcode';


@Injectable()
export class QueuesService {
  constructor(private prisma: PrismaService) {}

  async findAll(adminId: string) {
    return this.prisma.queue.findMany({
      where: { adminId },
      include: {
        _count: {
          select: {
            entries: {
              where: { status: 'WAITING' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, adminId: string) {
    const queue = await this.prisma.queue.findFirst({
      where: { id, adminId },
      include: {
        entries: {
          where: {
            status: { in: ['WAITING', 'NOTIFIED', 'SERVING'] }
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!queue) throw new NotFoundException('Queue not found');
    return queue;
  }

  async create(adminId: string, dto: CreateQueueDto)  {
    return this.prisma.queue.create({
      data: {
        name: dto.name,
        description: dto.description,
        adminId,
      },
    });
  }

  async update(id: string, adminId: string, dto: UpdateQueueDto) {
    await this.findOne(id, adminId);

    return this.prisma.queue.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, adminId: string) {
    await this.findOne(id, adminId);

    return this.prisma.queue.delete({ where: { id } });
  }

  async toggleOpen(id: string, adminId: string) {
    const queue = await this.findOne(id, adminId);
    return this.prisma.queue.update({
      where: { id },
      data: { isOpen: !queue.isOpen },
    });
  }

  

}