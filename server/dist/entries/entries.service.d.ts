import 'dotenv/config';
import { Queue } from 'bullmq';
import { JoinQueueDto } from './dto/join-queue.dto';
import { QueueGateway } from '../gateway/queue.gateway';
import { Entry } from '../../generated/prisma/client';
import { JoinQueueResponse, EntryStatusResponse } from './dto/entry-response.dto';
import { EntryRepository } from './entries.repository';
import { QueueRepository } from '../queues/queue.repository';
export declare class EntriesService {
    private entryRepo;
    private queueRepo;
    private notifQueue;
    private gateway;
    constructor(entryRepo: EntryRepository, queueRepo: QueueRepository, notifQueue: Queue, gateway: QueueGateway);
    join(queueId: string, dto: JoinQueueDto): Promise<JoinQueueResponse>;
    getStatus(token: string): Promise<EntryStatusResponse>;
    callNext(queueId: string, adminId: string): Promise<Entry>;
    complete(entryId: string, adminId: string): Promise<Entry>;
    leave(token: string): Promise<Entry>;
    findAll(queueId: string, adminId: string): Promise<import("./dto/entry-response.dto").ActiveEntry[]>;
    confirmArrival(queueId: string, adminId: string): Promise<Entry>;
    markNoShow(queueId: string, adminId: string): Promise<Entry>;
    private getEstimatedWait;
}
