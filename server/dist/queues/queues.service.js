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
exports.QueuesService = void 0;
const common_1 = require("@nestjs/common");
const queue_repository_1 = require("./queue.repository");
let QueuesService = class QueuesService {
    queueRepository;
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }
    async findAll(adminId) {
        return this.queueRepository.findAll(adminId);
    }
    async findOne(id, adminId) {
        return this.queueRepository.findOne(id, adminId);
    }
    async create(adminId, dto) {
        return this.queueRepository.create(adminId, dto);
    }
    async update(id, adminId, dto) {
        return this.queueRepository.update(id, adminId, dto);
    }
    async delete(id, adminId) {
        return this.queueRepository.delete(id, adminId);
    }
    async toggleOpen(id, adminId) {
        return this.queueRepository.toggleOpen(id, adminId);
    }
};
exports.QueuesService = QueuesService;
exports.QueuesService = QueuesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [queue_repository_1.QueueRepository])
], QueuesService);
//# sourceMappingURL=queues.service.js.map