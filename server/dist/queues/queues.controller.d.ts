import { QueuesService } from './queues.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
export declare class QueuesController {
    private service;
    constructor(service: QueuesService);
    findAll(req: any): Promise<({
        _count: {
            entries: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    })[]>;
    findOne(id: string, req: any): Promise<{
        entries: {
            id: string;
            email: string | null;
            createdAt: Date;
            name: string;
            status: import("../../generated/prisma/client").$Enums.EntryStatus;
            position: number;
            token: string;
            notifiedAt: Date | null;
            queueId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
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
    delete(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
}
