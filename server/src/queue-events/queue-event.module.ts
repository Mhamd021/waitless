// queue-event.module.ts
import { MongooseModule } from '@nestjs/mongoose';
import { QueueEvent, QueueEventSchema } from './queue-event.schema';
import { Module } from '@nestjs/common';
import { QueueEventService } from './queue-event.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QueueEvent.name, schema: QueueEventSchema }
    ])
  ],
  providers: [QueueEventService],
  exports: [QueueEventService],
})
export class QueueEventModule {}