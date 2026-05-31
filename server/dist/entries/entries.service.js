"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntriesService = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const queue_gateway_1 = require("../gateway/queue.gateway");
const entries_repository_1 = require("./entries.repository");
const queue_repository_1 = require("../queues/queue.repository");
let EntriesService = class EntriesService {
    entryRepo;
    queueRepo;
    notifQueue;
    gateway;
    constructor(entryRepo, queueRepo, notifQueue, gateway) {
        this.entryRepo = entryRepo;
        this.queueRepo = queueRepo;
        this.notifQueue = notifQueue;
        this.gateway = gateway;
    }
    async join(queueId, dto) {
        const queue = await this.queueRepo.findOpenById(queueId);
        if (!queue)
            throw new common_1.NotFoundException('Queue not found or closed');
        const lastEntry = await this.entryRepo.findLastInQueue(queueId);
        const nextPosition = lastEntry ? lastEntry.position + 1 : 1;
        const entry = await this.entryRepo.create({
            name: dto.name,
            email: dto.email,
            position: nextPosition,
            queueId,
        });
        const entries = await this.entryRepo.findActive(queueId);
        this.gateway.notifyQueueUpdate(queueId, { type: 'next-called', entries });
        return {
            id: entry.id,
            name: entry.name,
            position: nextPosition,
            token: entry.token,
            queueName: queue.name,
            trackingUrl: `http://localhost:3000/track/${entry.token}`,
        };
    }
    async getStatus(token) {
        const entry = await this.entryRepo.findByToken(token);
        if (!entry)
            throw new common_1.NotFoundException('Entry not found');
        const ahead = await this.entryRepo.countAhead(entry.queueId, entry.position);
        const avgServiceTime = await this.getEstimatedWait(entry.queueId);
        return {
            name: entry.name,
            position: entry.position,
            status: entry.status,
            ahead,
            queueName: entry.queue.name,
            isQueueOpen: entry.queue.isOpen,
            queueId: entry.queueId,
            estimatedWaitMinutes: ahead * avgServiceTime,
            avgServiceTimeMinutes: avgServiceTime,
        };
    }
    async callNext(queueId, adminId) {
        const queue = await this.queueRepo.findByIdAndAdmin(queueId, adminId);
        if (!queue)
            throw new common_1.NotFoundException('Queue not found');
        const currentlyServing = await this.entryRepo.findByStatus(queueId, 'SERVING');
        if (currentlyServing) {
            await this.entryRepo.updateById(currentlyServing.id, {
                status: 'DONE',
                completedAt: new Date(),
            });
        }
        const next = await this.entryRepo.findNextWaiting(queueId);
        if (!next)
            throw new common_1.BadRequestException('Queue is empty');
        const updated = await this.entryRepo.updateById(next.id, {
            status: 'CALLED',
        });
        if (next.email) {
            await this.notifQueue.add('your-turn-now', {
                email: next.email,
                name: next.name,
                queueName: queue.name,
            });
        }
        const secondInLine = await this.entryRepo.findSecondWaiting(queueId, next.id);
        if (secondInLine?.email) {
            await this.notifQueue.add('your-turn-soon', {
                email: secondInLine.email,
                name: secondInLine.name,
                position: 2,
                queueName: queue.name,
                trackingUrl: `http://localhost:3000/track/${secondInLine.token}`,
            }, { delay: 30_000 });
        }
        const entries = await this.entryRepo.findActive(queueId);
        this.gateway.notifyQueueUpdate(queueId, { type: 'next-called', entries });
        return updated;
    }
    async complete(entryId, adminId) {
        const entry = await this.entryRepo.findByIdAndAdmin(entryId, adminId);
        if (!entry)
            throw new common_1.NotFoundException('Entry not found');
        const updated = await this.entryRepo.updateById(entryId, {
            status: 'DONE',
            completedAt: new Date(),
        });
        const entries = await this.entryRepo.findActive(entry.queueId);
        this.gateway.notifyQueueUpdate(entry.queueId, { type: 'next-called', entries });
        return updated;
    }
    async leave(token) {
        const entry = await this.entryRepo.findByToken(token);
        if (!entry)
            throw new common_1.NotFoundException('Entry not found');
        if (entry.status === 'DONE' || entry.status === 'LEFT') {
            throw new common_1.BadRequestException('Already done or left');
        }
        const updated = await this.entryRepo.updateByToken(token, { status: 'LEFT' });
        const entries = await this.entryRepo.findActive(entry.queueId);
        this.gateway.notifyQueueUpdate(entry.queueId, { type: 'entry-left', entries });
        return updated;
    }
    async findAll(queueId, adminId) {
        const queue = await this.queueRepo.findByIdAndAdmin(queueId, adminId);
        if (!queue)
            throw new common_1.NotFoundException('Queue not found');
        return this.entryRepo.findActive(queueId);
    }
    async confirmArrival(queueId, adminId) {
        const queue = await this.queueRepo.findByIdAndAdmin(queueId, adminId);
        if (!queue)
            throw new common_1.NotFoundException('Queue not found');
        const called = await this.entryRepo.findByStatus(queueId, 'CALLED');
        if (!called)
            throw new common_1.BadRequestException('No called customer');
        const updated = await this.entryRepo.updateById(called.id, {
            status: 'SERVING',
            servedAt: new Date(),
        });
        const entries = await this.entryRepo.findActive(queueId);
        this.gateway.notifyQueueUpdate(queueId, { type: 'next-called', entries });
        return updated;
    }
    async markNoShow(queueId, adminId) {
        const queue = await this.queueRepo.findByIdAndAdmin(queueId, adminId);
        if (!queue)
            throw new common_1.NotFoundException('Queue not found');
        const called = await this.entryRepo.findByStatus(queueId, 'CALLED');
        if (!called)
            throw new common_1.BadRequestException('No called customer');
        await this.entryRepo.updateById(called.id, { status: 'NO_SHOW' });
        return this.callNext(queueId, adminId);
    }
    async getEstimatedWait(queueId) {
        const completed = await this.entryRepo.findCompleted(queueId, 5);
        if (completed.length === 0)
            return 0;
        const avgMinutes = completed.reduce((sum, entry) => {
            const diff = entry.completedAt.getTime() - entry.servedAt.getTime();
            return sum + diff / 60000;
        }, 0) / completed.length;
        return Math.round(avgMinutes);
    }
};
exports.EntriesService = EntriesService;
exports.EntriesService = EntriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [entries_repository_1.EntryRepository,
        queue_repository_1.QueueRepository,
        bullmq_2.Queue,
        queue_gateway_1.QueueGateway])
], EntriesService);
//# sourceMappingURL=entries.service.js.map