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
exports.EntriesController = void 0;
const common_1 = require("@nestjs/common");
const entries_service_1 = require("./entries.service");
const join_queue_dto_1 = require("./dto/join-queue.dto");
const jwt_guard_1 = require("../admin/jwt.guard");
let EntriesController = class EntriesController {
    service;
    constructor(service) {
        this.service = service;
    }
    join(queueId, dto) {
        return this.service.join(queueId, dto);
    }
    getStatus(token) {
        return this.service.getStatus(token);
    }
    leave(token) {
        return this.service.leave(token);
    }
    findAll(queueId, req) {
        return this.service.findAll(queueId, req.user.sub);
    }
    callNext(queueId, req) {
        return this.service.callNext(queueId, req.user.sub);
    }
    complete(id, req) {
        return this.service.complete(id, req.user.sub);
    }
};
exports.EntriesController = EntriesController;
__decorate([
    (0, common_1.Post)('queues/:queueId/join'),
    __param(0, (0, common_1.Param)('queueId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, join_queue_dto_1.JoinQueueDto]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "join", null);
__decorate([
    (0, common_1.Get)('track/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Patch)('track/:token/leave'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "leave", null);
__decorate([
    (0, common_1.Get)('queues/:queueId/entries'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('queueId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('queues/:queueId/next'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('queueId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "callNext", null);
__decorate([
    (0, common_1.Patch)('entries/:id/complete'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "complete", null);
exports.EntriesController = EntriesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [entries_service_1.EntriesService])
], EntriesController);
//# sourceMappingURL=entries.controller.js.map