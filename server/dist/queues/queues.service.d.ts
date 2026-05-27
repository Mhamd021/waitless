import { PrismaService } from '../prisma/prisma.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
export declare class QueuesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(adminId: string): Promise<({
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
    findOne(id: string, adminId: string): Promise<{
        entries: {
            id: string;
            email: string | null;
            createdAt: Date;
            name: string;
            status: import("../../generated/prisma/client").$Enums.EntryStatus;
            position: number;
            token: string;
            notifiedAt: Date | null;
            servedAt: Date | null;
            completedAt: Date | null;
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
    delete(id: string, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
    toggleOpen(id: string, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isOpen: boolean;
        adminId: string;
    }>;
}
