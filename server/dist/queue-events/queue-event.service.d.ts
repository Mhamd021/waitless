import { Model } from 'mongoose';
import { QueueEvent, QueueEventDocument, QueueEventType } from './queue-event.schema';
export declare class QueueEventService {
    private queueEventModel;
    constructor(queueEventModel: Model<QueueEventDocument>);
    record(data: {
        queueId: string;
        eventType: QueueEventType;
        token?: string;
        metadata?: Record<string, any>;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, QueueEvent, {}, import("mongoose").DefaultSchemaOptions> & QueueEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, QueueEvent, {}, import("mongoose").DefaultSchemaOptions> & QueueEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getQueueStats(queueId: string): Promise<{
        totalJoined: number;
        totalNoShows: number;
        totalArrived: number;
        totalLeft: number;
        totalCalled: number;
        noShowRate: number;
        completionRate: number;
        dropOffRate: number;
    }>;
}
