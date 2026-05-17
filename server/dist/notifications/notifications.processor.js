"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsProcessor = void 0;
require("dotenv/config");
const bullmq_1 = require("@nestjs/bullmq");
const resend_1 = require("resend");
let NotificationsProcessor = class NotificationsProcessor extends bullmq_1.WorkerHost {
    resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    async process(job) {
        switch (job.name) {
            case 'your-turn-soon':
                await this.sendYourTurnSoon(job.data);
                break;
            case 'your-turn-now':
                await this.sendYourTurnNow(job.data);
                break;
        }
    }
    async sendYourTurnSoon(data) {
        await this.resend.emails.send({
            from: process.env.MAIL_FROM,
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
    async sendYourTurnNow(data) {
        await this.resend.emails.send({
            from: process.env.MAIL_FROM,
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
};
exports.NotificationsProcessor = NotificationsProcessor;
exports.NotificationsProcessor = NotificationsProcessor = __decorate([
    (0, bullmq_1.Processor)('notifications')
], NotificationsProcessor);
//# sourceMappingURL=notifications.processor.js.map