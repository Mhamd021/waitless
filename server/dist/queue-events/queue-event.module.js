"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueEventModule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const queue_event_schema_1 = require("./queue-event.schema");
const common_1 = require("@nestjs/common");
const queue_event_service_1 = require("./queue-event.service");
let QueueEventModule = class QueueEventModule {
};
exports.QueueEventModule = QueueEventModule;
exports.QueueEventModule = QueueEventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: queue_event_schema_1.QueueEvent.name, schema: queue_event_schema_1.QueueEventSchema }
            ])
        ],
        providers: [queue_event_service_1.QueueEventService],
        exports: [queue_event_service_1.QueueEventService],
    })
], QueueEventModule);
//# sourceMappingURL=queue-event.module.js.map