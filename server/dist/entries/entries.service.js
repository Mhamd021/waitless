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
const prisma_service_1 = require("../prisma/prisma.service");
const queue_gateway_1 = require("../gateway/queue.gateway");
let EntriesService = class EntriesService {
    prisma;
    notifQueue;
    gateway;
    constructor(prisma, notifQueue, gateway) {
        this.prisma = prisma;
        this.notifQueue = notifQueue;
        this.gateway = gateway;
    }
    async join(queueId, dto) {
        const queue = await this.prisma.queue.findFirst({
            where: { id: queueId, isOpen: true },
        });
        if (!queue)
            throw new common_1.NotFoundException('Queue not found or closed');
        const lastEntry = await this.prisma.entry.findFirst({
            where: { queueId },
            orderBy: { position: 'desc' },
        });
        const nextPosition = lastEntry ? lastEntry.position + 1 : 1;
        const entry = await this.prisma.entry.create({
            data: {
                name: dto.name,
                email: dto.email,
                position: nextPosition,
                queueId,
            },
            include: { queue: { select: { name: true } } },
        });
        const entries = await this.getActiveEntries(queueId);
        this.gateway.notifyQueueUpdate(queueId, {
            type: 'next-called',
            entries,
        });
        return {
            id: entry.id,
            name: entry.name,
            position: nextPosition,
            token: entry.token,
            queueName: entry.queue.name,
            trackingUrl: `http://localhost:3001/track/${entry.token}`,
        };
    }
    async getStatus(token) {
        const entry = await this.prisma.entry.findUnique({
            where: { token },
            include: { queue: { select: { name: true, isOpen: true } } },
        });
        if (!entry)
            throw new common_1.NotFoundException('Entry not found');
        const ahead = await this.prisma.entry.count({
            where: {
                queueId: entry.queueId,
                position: { lt: entry.position },
                status: { in: ['WAITING', 'NOTIFIED'] },
            },
        });
        return {
            name: entry.name,
            position: entry.position,
            status: entry.status,
            ahead,
            queueName: entry.queue.name,
            isQueueOpen: entry.queue.isOpen,
            queueId: entry.queueId,
        };
    }
    async callNext(queueId, adminId) {
        const queue = await this.prisma.queue.findFirst({
            where: { id: queueId, adminId },
        });
        if (!queue)
            throw new common_1.NotFoundException('Queue not found');
        const currentlyServing = await this.prisma.entry.findFirst({
            where: { queueId, status: 'SERVING' },
        });
        if (currentlyServing) {
            await this.prisma.entry.update({
                where: { id: currentlyServing.id },
                data: { status: 'DONE' },
            });
        }
        const next = await this.prisma.entry.findFirst({
            where: { queueId, status: 'WAITING' },
            orderBy: { position: 'asc' },
        });
        if (!next)
            throw new common_1.BadRequestException('Queue is empty');
        const updated = await this.prisma.entry.update({
            where: { id: next.id },
            data: { status: 'SERVING' },
        });
        if (next.email) {
            await this.notifQueue.add('your-turn-now', {
                email: next.email,
                name: next.name,
                queueName: queue.name,
            });
        }
        const secondInLine = await this.prisma.entry.findFirst({
            where: { queueId, status: 'WAITING' },
            orderBy: { position: 'asc' },
        });
        if (secondInLine?.email) {
            await this.notifQueue.add('your-turn-soon', {
                email: secondInLine.email,
                name: secondInLine.name,
                position: 2,
                queueName: queue.name,
                trackingUrl: `http://localhost:3001/track/${secondInLine.token}`,
            }, { delay: 30_000 });
        }
        const entries = await this.getActiveEntries(queueId);
        this.gateway.notifyQueueUpdate(queueId, {
            type: 'next-called',
            entries,
        });
        return updated;
    }
    async complete(entryId, adminId) {
        const entry = await this.prisma.entry.findFirst({
            where: { id: entryId, queue: { adminId } },
        });
        if (!entry)
            throw new common_1.NotFoundException('Entry not found');
        const updated = await this.prisma.entry.update({
            where: { id: entryId },
            data: { status: 'DONE' },
        });
        const entries = await this.getActiveEntries(entry.queueId);
        this.gateway.notifyQueueUpdate(entry.queueId, {
            type: 'next-called',
            entries,
        });
        return updated;
    }
    async leave(token) {
        const entry = await this.prisma.entry.findUnique({
            where: { token },
        });
        if (!entry)
            throw new common_1.NotFoundException('Entry not found');
        if (entry.status === 'DONE' || entry.status === 'LEFT') {
            throw new common_1.BadRequestException('Already done or left');
        }
        const updated = await this.prisma.entry.update({
            where: { token },
            data: { status: 'LEFT' },
        });
        const entries = await this.getActiveEntries(entry.queueId);
        this.gateway.notifyQueueUpdate(entry.queueId, {
            type: 'entry-left',
            entries,
        });
        return updated;
    }
    async findAll(queueId, adminId) {
        const queue = await this.prisma.queue.findFirst({
            where: { id: queueId, adminId },
        });
        if (!queue)
            throw new common_1.NotFoundException('Queue not found');
        return this.getActiveEntries(queueId);
    }
    async getActiveEntries(queueId) {
        return this.prisma.entry.findMany({
            where: {
                queueId,
                status: { in: ['WAITING', 'NOTIFIED', 'SERVING'] },
            },
            orderBy: { position: 'asc' },
            select: {
                id: true,
                name: true,
                position: true,
                status: true,
                token: true,
            },
        });
    }
};
exports.EntriesService = EntriesService;
exports.EntriesService = EntriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue,
        queue_gateway_1.QueueGateway])
], EntriesService);
//# sourceMappingURL=entries.service.js.map