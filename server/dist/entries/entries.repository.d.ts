import 'dotenv/config';
import { PrismaService } from '../prisma/prisma.service';
import { ActiveEntry } from './dto/entry-response.dto';
import { EntryStatus, Prisma } from '../../generated/prisma/client';
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
        queueId: string;
        token: string;
        notifiedAt: Date | null;
        servedAt: Date | null;
        completedAt: Date | null;
    }) | null>;
    findFirst(where: Prisma.EntryWhereInput): Promise<{
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
    } | null>;
    create(data: Prisma.EntryUncheckedCreateInput): Promise<{
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
        queueId: string;
        token: string;
        notifiedAt: Date | null;
        servedAt: Date | null;
        completedAt: Date | null;
    }>;
    findActive(queueId: string): Promise<ActiveEntry[]>;
    findCompleted(queueId: string, take: number): Promise<{
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
    }[]>;
    findLastInQueue(queueId: string): Promise<{
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
    } | null>;
    countAhead(queueId: string, position: number): Promise<number>;
    findByStatus(queueId: string, status: EntryStatus): Promise<{
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
    } | null>;
    findNextWaiting(queueId: string): Promise<{
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
    } | null>;
    findSecondWaiting(queueId: string, excludeId: string): Promise<{
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
    } | null>;
    findByIdAndAdmin(entryId: string, adminId: string): Promise<{
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
    } | null>;
    updateById(id: string, data: Prisma.EntryUpdateInput): Promise<{
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
    updateByToken(token: string, data: Prisma.EntryUpdateInput): Promise<{
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
