import { QueuesService } from './queues.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
export declare class QueuesController {
    private service;
    constructor(service: QueuesService);
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    } | null>;
    getQrCode(id: string): Promise<{
        qr: string;
    }>;
    create(dto: CreateQueueDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
    update(id: string, dto: UpdateQueueDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
    toggle(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
    delete(id: string, req: any): Promise<void>;
}
