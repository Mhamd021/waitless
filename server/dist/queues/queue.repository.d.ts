import { PrismaService } from '../prisma/prisma.service';
import { Queue } from '../../generated/prisma/client';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
export declare class QueueRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(adminId: string): Promise<Queue[]>;
    findOne(id: string, adminId: string): Promise<Queue | null>;
    create(adminId: string, dto: CreateQueueDto): Promise<Queue>;
    update(id: string, adminId: string, dto: UpdateQueueDto): Promise<Queue>;
    delete(id: string, adminId: string): Promise<void>;
    toggleOpen(id: string, adminId: string): Promise<Queue>;
    findOpenById(queueId: string): Promise<Queue | null>;
}
