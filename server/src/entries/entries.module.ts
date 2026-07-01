import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { AdminModule } from '../admin/admin.module';
import { BullModule } from '@nestjs/bullmq';
import { GatewayModule } from '../gateway/gateway.module';
import { EntryRepository } from './entries.repository';
import { QueuesModule } from '../queues/queues.module';
import { QueueEventModule } from '../queue-events/queue-event.module';


@Module({
  imports: [AdminModule,    BullModule.registerQueue({ name: 'notifications' }), GatewayModule,QueuesModule,QueueEventModule],
  providers: [EntriesService, EntryRepository],
  controllers: [EntriesController],
  exports: [EntriesService,EntryRepository],
})
export class EntriesModule {}