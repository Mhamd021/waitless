import 'dotenv/config';
import { PrismaService } from '../prisma/prisma.service';
import { ActiveEntry } from './dto/entry-response.dto';
export declare class EntryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findByToken(token: string): Promise<({
        queue: {
            name: string;
            isOpen: boolean;
        };
    } & {
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
    }) | null>;
    findFirst(where: any): Promise<{
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
    } | null>;
    create(data: any): Promise<{
        queue: {
            name: string;
        };
    } & {
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
    update(where: any, data: any): Promise<{
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
    count(where: any): Promise<number>;
    findActive(queueId: string): Promise<ActiveEntry[]>;
    findCompleted(queueId: string, take: number): Promise<{
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
    }[]>;
    findLastInQueue(queueId: string): Promise<{
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
    } | null>;
    countAhead(queueId: string, position: number): Promise<number>;
    findByStatus(queueId: string, status: string): Promise<{
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
    } | null>;
    findNextWaiting(queueId: string): Promise<{
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
    } | null>;
    findSecondWaiting(queueId: string, excludeId: string): Promise<{
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
    } | null>;
    findByIdAndAdmin(entryId: string, adminId: string): Promise<{
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
    } | null>;
    updateById(id: string, data: any): Promise<{
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
    updateByToken(token: string, data: any): Promise<{
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
    findOpenById(queueId: string): void;
}
