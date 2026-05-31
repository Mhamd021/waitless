import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { AdminModule } from '../admin/admin.module';
import { QueueRepository } from './queue.repository';

@Module({
  imports: [AdminModule], 
  providers: [QueuesService,QueueRepository],
  controllers: [QueuesController],
  exports: [QueuesService,QueueRepository],
})
export class QueuesModule {}