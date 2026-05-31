import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueueRepository } from './queue.repository';
export declare class QueuesService {
    private queueRepository;
    constructor(queueRepository: QueueRepository);
    findAll(adminId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }[]>;
    findOne(id: string, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    } | null>;
    create(adminId: string, dto: CreateQueueDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
    update(id: string, adminId: string, dto: UpdateQueueDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
    delete(id: string, adminId: string): Promise<void>;
    toggleOpen(id: string, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
}
