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
exports.QueueEventSchema = exports.QueueEvent = exports.QueueEventType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var QueueEventType;
(function (QueueEventType) {
    QueueEventType["CUSTOMER_JOINED"] = "CUSTOMER_JOINED";
    QueueEventType["CALLED_NEXT"] = "CALLED_NEXT";
    QueueEventType["NO_SHOW"] = "NO_SHOW";
    QueueEventType["ARRIVED"] = "ARRIVED";
    QueueEventType["QUEUE_CLOSED"] = "QUEUE_CLOSED";
    QueueEventType["CUSTOMER_LEFT"] = "CUSTOMER_LEFT";
})(QueueEventType || (exports.QueueEventType = QueueEventType = {}));
let QueueEvent = class QueueEvent {
    queueId;
    eventType;
    token;
    metadata;
};
exports.QueueEvent = QueueEvent;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], QueueEvent.prototype, "queueId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: QueueEventType }),
    __metadata("design:type", String)
], QueueEvent.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], QueueEvent.prototype, "token", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], QueueEvent.prototype, "metadata", void 0);
exports.QueueEvent = QueueEvent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], QueueEvent);
exports.QueueEventSchema = mongoose_1.SchemaFactory.createForClass(QueueEvent);
//# sourceMappingURL=queue-event.schema.js.map