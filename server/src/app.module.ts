import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { QueuesModule } from './queues/queues.module';
import { EntriesModule } from './entries/entries.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GatewayModule } from './gateway/gateway.module';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [
     MongooseModule.forRoot(process.env.MONGODB_URI!),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
    }),
    PrismaModule,
    AdminModule,
    QueuesModule,
    EntriesModule,
    GatewayModule,
    NotificationsModule,
  ],
})
export class AppModule {}