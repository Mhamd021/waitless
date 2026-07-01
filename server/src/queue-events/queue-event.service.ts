// queue-event.service.ts
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueueEvent, QueueEventDocument, QueueEventType } from './queue-event.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueEventService {    
  constructor(
    @InjectModel(QueueEvent.name)
    private queueEventModel: Model<QueueEventDocument>
  ) {}

  async record(data: {
    queueId: string;
    eventType: QueueEventType;
    token?: string;
    metadata?: Record<string, any>;
  }) {
    const event = new this.queueEventModel(data);
    return event.save();
  }
  async getQueueStats(queueId: string) {
  const counts = await this.queueEventModel.aggregate([
    { $match: { queueId } },
    
    // Stage 2: group by event type and count each one
    { $group: {
      _id: '$eventType',
      count: { $sum: 1 }
    }},
  ]);

  
  const map: Record<string, number> = {};
  for (const item of counts) {
    map[item._id] = item.count;
  }

  const joined   = map['CUSTOMER_JOINED'] ?? 0;
  const noShows  = map['NO_SHOW']         ?? 0;
  const arrived  = map['ARRIVED']         ?? 0;
  const left     = map['CUSTOMER_LEFT']   ?? 0;
  const called   = map['CALLED_NEXT']     ?? 0;

  return {
    totalJoined:      joined,
    totalNoShows:     noShows,
    totalArrived:     arrived,
    totalLeft:        left,
    totalCalled:      called,
    noShowRate:       joined > 0 ? Math.round((noShows  / joined) * 100) : 0,
    completionRate:   joined > 0 ? Math.round((arrived  / joined) * 100) : 0,
    dropOffRate:      joined > 0 ? Math.round((left     / joined) * 100) : 0,
  };
}
}