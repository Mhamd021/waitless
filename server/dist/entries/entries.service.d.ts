import 'dotenv/config';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { JoinQueueDto } from './dto/join-queue.dto';
import { QueueGateway } from '../gateway/queue.gateway';
export declare class EntriesService {
    private prisma;
    private notifQueue;
    private gateway;
    constructor(prisma: PrismaService, notifQueue: Queue, gateway: QueueGateway);
    join(queueId: string, dto: JoinQueueDto): Promise<{
        id: string;
        name: string;
        position: number;
        token: string;
        queueName: string;
        trackingUrl: string;
    }>;
    getStatus(token: string): Promise<{
        name: string;
        position: number;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        ahead: number;
        queueName: string;
        isQueueOpen: boolean;
        queueId: string;
    }>;
    callNext(queueId: string, adminId: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        token: string;
        notifiedAt: Date | null;
        queueId: string;
    }>;
    complete(entryId: string, adminId: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        token: string;
        notifiedAt: Date | null;
        queueId: string;
    }>;
    leave(token: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        token: string;
        notifiedAt: Date | null;
        queueId: string;
    }>;
    findAll(queueId: string, adminId: string): Promise<{
        id: string;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        token: string;
    }[]>;
    private getActiveEntries;
}
