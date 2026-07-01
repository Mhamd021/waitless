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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryRepository = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EntryRepository = class EntryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByToken(token) {
        return this.prisma.entry.findUnique({
            where: { token },
            include: { queue: { select: { name: true, isOpen: true } } },
        });
    }
    async findFirst(where) {
        return this.prisma.entry.findFirst({ where });
    }
    async create(data) {
        return this.prisma.entry.create({ data, include: { queue: { select: { name: true } } } });
    }
    async findActive(queueId) {
        return this.prisma.entry.findMany({
            where: {
                queueId,
                status: { in: ['WAITING', 'NOTIFIED', 'SERVING', 'CALLED'] },
            },
            orderBy: { position: 'asc' },
            select: {
                id: true, name: true, position: true,
                status: true, token: true, email: true,
            },
        });
    }
    async findCompleted(queueId, take) {
        return this.prisma.entry.findMany({
            where: {
                queueId, status: 'DONE',
                servedAt: { not: null },
                completedAt: { not: null },
            },
            orderBy: { completedAt: 'desc' },
            take,
        });
    }
    async findLastInQueue(queueId) {
        return this.prisma.entry.findFirst({
            where: { queueId },
            orderBy: { position: 'desc' },
        });
    }
    async countAhead(queueId, position) {
        return this.prisma.entry.count({
            where: {
                queueId,
                position: { lt: position },
                status: { in: ['WAITING', 'NOTIFIED'] },
            },
        });
    }
    async findByStatus(queueId, status) {
        return this.prisma.entry.findFirst({
            where: { queueId, status: status },
            orderBy: { position: 'asc' },
        });
    }
    async findNextWaiting(queueId) {
        return this.prisma.entry.findFirst({
            where: { queueId, status: { in: ['WAITING', 'NOTIFIED'] } },
            orderBy: { position: 'asc' },
        });
    }
    async findSecondWaiting(queueId, excludeId) {
        return this.prisma.entry.findFirst({
            where: {
                queueId,
                status: { in: ['WAITING', 'NOTIFIED'] },
                id: { not: excludeId },
            },
            orderBy: { position: 'asc' },
        });
    }
    async findByIdAndAdmin(entryId, adminId) {
        return this.prisma.entry.findFirst({
            where: { id: entryId, queue: { adminId } },
        });
    }
    async updateById(id, data) {
        return this.prisma.entry.update({ where: { id }, data });
    }
    async updateByToken(token, data) {
        return this.prisma.entry.update({ where: { token }, data });
    }
};
exports.EntryRepository = EntryRepository;
exports.EntryRepository = EntryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EntryRepository);
//# sourceMappingURL=entries.repository.js.map