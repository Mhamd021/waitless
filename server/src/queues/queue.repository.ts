import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Queue } from '../../generated/prisma/client';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

@Injectable()
export class QueueRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(adminId: string):Promise<Queue[]> {
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
  
    async findOne(id: string, adminId: string):Promise<Queue | null> {
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
  
    async create(adminId: string, dto: CreateQueueDto) : Promise<Queue> {
      return this.prisma.queue.create({
        data: {
          name: dto.name,
          description: dto.description,
          adminId,
        },
      });
    }
  
    async update(id: string, adminId: string, dto: UpdateQueueDto): Promise<Queue> {
      await this.findOne(id, adminId);
  
      return this.prisma.queue.update({
        where: { id },
        data: dto,
      });
    }
  
    async delete(id: string, adminId: string) :Promise<void>{
  
       await this.prisma.queue.delete({ where: { id, adminId } });
    }
  
    async toggleOpen(id: string, adminId: string) :Promise<Queue> {
      const queue = await this.findOne(id, adminId);
      return this.prisma.queue.update({
        where: { id },
        data: { isOpen: queue!.isOpen },
      });
    }

    async findByIdAndAdmin(queueId: string, adminId: string): Promise<Queue | null> {
      return this.prisma.queue.findFirst({
        where: { id: queueId, adminId },
      });
    }
    async findOpenById(queueId: string): Promise<Queue | null> {
      
      return this.prisma.queue.findUnique({
        where: { id: queueId , isOpen: true}
        ,
      });
    }
  
}