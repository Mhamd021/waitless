// queue-event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QueueEventDocument = HydratedDocument<QueueEvent>;

export enum QueueEventType {
  CUSTOMER_JOINED = 'CUSTOMER_JOINED',
  CALLED_NEXT = 'CALLED_NEXT',
  NO_SHOW = 'NO_SHOW',
  ARRIVED = 'ARRIVED',
  QUEUE_CLOSED = 'QUEUE_CLOSED',
  CUSTOMER_LEFT = 'CUSTOMER_LEFT',
}

@Schema({ timestamps: true })
export class QueueEvent {
  @Prop({ required: true })
  queueId!: string;

  @Prop({ required: true, enum: QueueEventType })
  eventType!: QueueEventType;

  @Prop()
  token?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const QueueEventSchema = SchemaFactory.createForClass(QueueEvent);