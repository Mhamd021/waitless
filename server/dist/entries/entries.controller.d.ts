import { EntriesService } from './entries.service';
import { JoinQueueDto } from './dto/join-queue.dto';
export declare class EntriesController {
    private service;
    constructor(service: EntriesService);
    join(queueId: string, dto: JoinQueueDto): Promise<import("./dto/entry-response.dto").JoinQueueResponse>;
    getStatus(token: string): Promise<import("./dto/entry-response.dto").EntryStatusResponse>;
    leave(token: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        queueId: string;
        token: string;
        notifiedAt: Date | null;
        servedAt: Date | null;
        completedAt: Date | null;
    }>;
    findAll(queueId: string, req: any): Promise<import("./dto/entry-response.dto").ActiveEntry[]>;
    callNext(queueId: string, req: any): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        queueId: string;
        token: string;
        notifiedAt: Date | null;
        servedAt: Date | null;
        completedAt: Date | null;
    }>;
    complete(id: string, req: any): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        queueId: string;
        token: string;
        notifiedAt: Date | null;
        servedAt: Date | null;
        completedAt: Date | null;
    }>;
    confirmArrival(queueId: string, req: any): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        queueId: string;
        token: string;
        notifiedAt: Date | null;
        servedAt: Date | null;
        completedAt: Date | null;
    }>;
    markNoShow(queueId: string, req: any): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        name: string;
        status: import("../../generated/prisma/client").$Enums.EntryStatus;
        position: number;
        queueId: string;
        token: string;
        notifiedAt: Date | null;
        servedAt: Date | null;
        completedAt: Date | null;
    }>;
}
