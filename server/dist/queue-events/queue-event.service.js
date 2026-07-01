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
exports.QueueEventService = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const queue_event_schema_1 = require("./queue-event.schema");
const common_1 = require("@nestjs/common");
let QueueEventService = class QueueEventService {
    queueEventModel;
    constructor(queueEventModel) {
        this.queueEventModel = queueEventModel;
    }
    async record(data) {
        const event = new this.queueEventModel(data);
        return event.save();
    }
    async getQueueStats(queueId) {
        const counts = await this.queueEventModel.aggregate([
            { $match: { queueId } },
            { $group: {
                    _id: '$eventType',
                    count: { $sum: 1 }
                } },
        ]);
        const map = {};
        for (const item of counts) {
            map[item._id] = item.count;
        }
        const joined = map['CUSTOMER_JOINED'] ?? 0;
        const noShows = map['NO_SHOW'] ?? 0;
        const arrived = map['ARRIVED'] ?? 0;
        const left = map['CUSTOMER_LEFT'] ?? 0;
        const called = map['CALLED_NEXT'] ?? 0;
        return {
            totalJoined: joined,
            totalNoShows: noShows,
            totalArrived: arrived,
            totalLeft: left,
            totalCalled: called,
            noShowRate: joined > 0 ? Math.round((noShows / joined) * 100) : 0,
            completionRate: joined > 0 ? Math.round((arrived / joined) * 100) : 0,
            dropOffRate: joined > 0 ? Math.round((left / joined) * 100) : 0,
        };
    }
};
exports.QueueEventService = QueueEventService;
exports.QueueEventService = QueueEventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(queue_event_schema_1.QueueEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], QueueEventService);
//# sourceMappingURL=queue-event.service.js.map