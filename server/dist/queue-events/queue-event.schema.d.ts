import { HydratedDocument } from 'mongoose';
export type QueueEventDocument = HydratedDocument<QueueEvent>;
export declare enum QueueEventType {
    CUSTOMER_JOINED = "CUSTOMER_JOINED",
    CALLED_NEXT = "CALLED_NEXT",
    NO_SHOW = "NO_SHOW",
    ARRIVED = "ARRIVED",
    QUEUE_CLOSED = "QUEUE_CLOSED",
    CUSTOMER_LEFT = "CUSTOMER_LEFT"
}
export declare class QueueEvent {
    queueId: string;
    eventType: QueueEventType;
    token?: string;
    metadata?: Record<string, any>;
}
export declare const QueueEventSchema: import("mongoose").Schema<QueueEvent, import("mongoose").Model<QueueEvent, any, any, any, any, any, QueueEvent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, QueueEvent, import("mongoose").Document<unknown, {}, QueueEvent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<QueueEvent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    queueId?: import("mongoose").SchemaDefinitionProperty<string, QueueEvent, import("mongoose").Document<unknown, {}, QueueEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QueueEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    eventType?: import("mongoose").SchemaDefinitionProperty<QueueEventType, QueueEvent, import("mongoose").Document<unknown, {}, QueueEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QueueEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    token?: import("mongoose").SchemaDefinitionProperty<string | undefined, QueueEvent, import("mongoose").Document<unknown, {}, QueueEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QueueEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, QueueEvent, import("mongoose").Document<unknown, {}, QueueEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QueueEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, QueueEvent>;
