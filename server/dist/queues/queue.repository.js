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
exports.QueueRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QueueRepository = class QueueRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(adminId) {
        return this.prisma.queue.findMany({
            where: { adminId },
            include: {
                _count: {
                    select: {
                        entries: {
                            where: { status: 'WAITING' }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, adminId) {
        const queue = await this.prisma.queue.findFirst({
            where: { id, adminId },
            include: {
                entries: {
                    where: {
                        status: { in: ['WAITING', 'NOTIFIED', 'SERVING'] }
                    },
                    orderBy: { position: 'asc' },
                },
            },
        });
        if (!queue)
            throw new common_1.NotFoundException('Queue not found');
        return queue;
    }
    async create(adminId, dto) {
        return this.prisma.queue.create({
            data: {
                name: dto.name,
                description: dto.description,
                adminId,
            },
        });
    }
    async update(id, adminId, dto) {
        await this.findOne(id, adminId);
        return this.prisma.queue.update({
            where: { id },
            data: dto,
        });
    }
    async delete(id, adminId) {
        await this.prisma.queue.delete({ where: { id, adminId } });
    }
    async toggleOpen(id, adminId) {
        const queue = await this.findOne(id, adminId);
        return this.prisma.queue.update({
            where: { id },
            data: { isOpen: queue.isOpen },
        });
    }
    async findOpenById(queueId) {
        return this.prisma.queue.findUnique({
            where: { id: queueId, isOpen: true },
        });
    }
};
exports.QueueRepository = QueueRepository;
exports.QueueRepository = QueueRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QueueRepository);
//# sourceMappingURL=queue.repository.js.map