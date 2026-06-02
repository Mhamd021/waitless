import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueueRepository } from './queue.repository';


@Injectable()
export class QueuesService {
  constructor(private queueRepository: QueueRepository) {}

  async findAll(adminId: string) {
    return this.queueRepository.findAll(adminId);
  }

  async findOne(id: string, adminId: string) {
    return this.queueRepository.findOne(id, adminId);
  }

  async create(adminId: string, dto: CreateQueueDto) {
    
    return this.queueRepository.create(adminId, dto);
  }

  async update(id: string, adminId: string, dto: UpdateQueueDto) {
    return this.queueRepository.update(id, adminId, dto);
  }

  async delete(id: string, adminId: string) {
    return this.queueRepository.delete(id, adminId);
  }

  async toggleOpen(id: string, adminId: string) {
    return this.queueRepository.toggleOpen(id, adminId);
  }
}
