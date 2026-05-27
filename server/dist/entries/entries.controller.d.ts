import { EntriesService } from './entries.service';
import { JoinQueueDto } from './dto/join-queue.dto';
export declare class EntriesController {
    private service;
    constructor(service: EntriesService);
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
        estimatedWaitMinutes: number;
        avgServiceTimeMinutes: number;
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
        servedAt: Date | null;
        completedAt: Date | null;
        queueId: string;
    }>;
    findAll(queueId: string, req: any): Promise<{
        id: string;
        email: string | null;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        token: string;
    }[]>;
    callNext(queueId: string, req: any): Promise<{
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
    }>;
    complete(id: string, req: any): Promise<{
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
    }>;
    confirmArrival(queueId: string, req: any): Promise<{
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
    }>;
    markNoShow(queueId: string, req: any): Promise<{
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
    }>;
}
