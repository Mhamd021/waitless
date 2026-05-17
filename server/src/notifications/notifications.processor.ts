import 'dotenv/config';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Resend } from 'resend';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async process(job: Job) {
    switch (job.name) {
      case 'your-turn-soon':
        await this.sendYourTurnSoon(job.data);
        break;
      case 'your-turn-now':
        await this.sendYourTurnNow(job.data);
        break;
    }
  }

  private async sendYourTurnSoon(data: {
    email: string;
    name: string;
    position: number;
    queueName: string;
    trackingUrl: string;
  }) {
    await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: data.email,
      subject: `🔔 دورك قريب في ${data.queueName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#3B82F6">Waitless 🔔</h2>
          <p>مرحباً <strong>${data.name}</strong>،</p>
          <p>أنت الآن <strong>رقم ${data.position}</strong> 
             في قائمة <strong>${data.queueName}</strong>.</p>
          <p>دورك قريب — يرجى التواجد.</p>
          <a href="${data.trackingUrl}"
             style="display:inline-block;background:#3B82F6;color:white;
                    padding:12px 24px;border-radius:8px;text-decoration:none">
            تابع موقعك
          </a>
        </div>
      `,
    });
  }

  private async sendYourTurnNow(data: {
    email: string;
    name: string;
    queueName: string;
  }) {
    await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: data.email,
      subject: `✅ دورك الآن في ${data.queueName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#10B981">Waitless ✅</h2>
          <p>مرحباً <strong>${data.name}</strong>،</p>
          <p>دورك الآن في <strong>${data.queueName}</strong>.</p>
          <p>يرجى التوجه فوراً.</p>
        </div>
      `,
    });
  }
}