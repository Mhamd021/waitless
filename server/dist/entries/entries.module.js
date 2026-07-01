"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntriesModule = void 0;
const common_1 = require("@nestjs/common");
const entries_service_1 = require("./entries.service");
const entries_controller_1 = require("./entries.controller");
const admin_module_1 = require("../admin/admin.module");
const bullmq_1 = require("@nestjs/bullmq");
const gateway_module_1 = require("../gateway/gateway.module");
const entries_repository_1 = require("./entries.repository");
const queues_module_1 = require("../queues/queues.module");
const queue_event_module_1 = require("../queue-events/queue-event.module");
let EntriesModule = class EntriesModule {
};
exports.EntriesModule = EntriesModule;
exports.EntriesModule = EntriesModule = __decorate([
    (0, common_1.Module)({
        imports: [admin_module_1.AdminModule, bullmq_1.BullModule.registerQueue({ name: 'notifications' }), gateway_module_1.GatewayModule, queues_module_1.QueuesModule, queue_event_module_1.QueueEventModule],
        providers: [entries_service_1.EntriesService, entries_repository_1.EntryRepository],
        controllers: [entries_controller_1.EntriesController],
        exports: [entries_service_1.EntriesService, entries_repository_1.EntryRepository],
    })
], EntriesModule);
//# sourceMappingURL=entries.module.js.map