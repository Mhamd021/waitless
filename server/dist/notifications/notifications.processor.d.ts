import 'dotenv/config';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class NotificationsProcessor extends WorkerHost {
    private resend;
    process(job: Job): Promise<void>;
    private sendYourTurnSoon;
    private sendYourTurnNow;
}
