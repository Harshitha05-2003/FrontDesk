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
exports.QueueService = exports.UpdateQueueDto = exports.CreateQueueDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_validator_1 = require("class-validator");
const queue_entity_1 = require("./queue.entity");
class CreateQueueDto {
}
exports.CreateQueueDto = CreateQueueDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQueueDto.prototype, "patientName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQueueDto.prototype, "patientPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQueueDto.prototype, "patientEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQueueDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(queue_entity_1.QueuePriority),
    __metadata("design:type", String)
], CreateQueueDto.prototype, "priority", void 0);
class UpdateQueueDto {
}
exports.UpdateQueueDto = UpdateQueueDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQueueDto.prototype, "patientName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQueueDto.prototype, "patientPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQueueDto.prototype, "patientEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQueueDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(queue_entity_1.QueueStatus),
    __metadata("design:type", String)
], UpdateQueueDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(queue_entity_1.QueuePriority),
    __metadata("design:type", String)
], UpdateQueueDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateQueueDto.prototype, "estimatedWaitTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateQueueDto.prototype, "calledTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateQueueDto.prototype, "completedTime", void 0);
let QueueService = class QueueService {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }
    async create(createQueueDto) {
        const lastQueue = await this.queueRepository.findOne({
            where: {},
            order: { queueNumber: 'DESC' },
        });
        const queueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;
        const queue = this.queueRepository.create({
            ...createQueueDto,
            queueNumber,
            checkInTime: new Date(),
        });
        return this.queueRepository.save(queue);
    }
    async findAll() {
        return this.queueRepository.find({
            order: {
                priority: 'ASC',
                checkInTime: 'ASC',
            },
        });
    }
    async findActive() {
        return this.queueRepository.find({
            where: [
                { status: queue_entity_1.QueueStatus.WAITING },
                { status: queue_entity_1.QueueStatus.WITH_DOCTOR },
            ],
            order: {
                priority: 'ASC',
                checkInTime: 'ASC',
            },
        });
    }
    async findOne(id) {
        return this.queueRepository.findOne({ where: { id } });
    }
    async findByStatus(status) {
        return this.queueRepository.find({
            where: { status },
            order: {
                priority: 'ASC',
                checkInTime: 'ASC',
            },
        });
    }
    async findByPriority(priority) {
        return this.queueRepository.find({
            where: { priority },
            order: { checkInTime: 'ASC' },
        });
    }
    async getNextInQueue() {
        return this.queueRepository.findOne({
            where: { status: queue_entity_1.QueueStatus.WAITING },
            order: {
                priority: 'ASC',
                checkInTime: 'ASC',
            },
        });
    }
    async update(id, updateQueueDto) {
        if (updateQueueDto.status === queue_entity_1.QueueStatus.WITH_DOCTOR) {
            updateQueueDto.calledTime = new Date();
        }
        else if (updateQueueDto.status === queue_entity_1.QueueStatus.COMPLETED) {
            updateQueueDto.completedTime = new Date();
        }
        await this.queueRepository.update(id, updateQueueDto);
        return this.findOne(id);
    }
    async updateStatus(id, status) {
        const updateData = { status };
        if (status === queue_entity_1.QueueStatus.WITH_DOCTOR) {
            updateData.calledTime = new Date();
        }
        else if (status === queue_entity_1.QueueStatus.COMPLETED) {
            updateData.completedTime = new Date();
        }
        await this.queueRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.queueRepository.delete(id);
    }
    async getQueueStats() {
        const [waiting, withDoctor, completed, cancelled] = await Promise.all([
            this.queueRepository.count({ where: { status: queue_entity_1.QueueStatus.WAITING } }),
            this.queueRepository.count({ where: { status: queue_entity_1.QueueStatus.WITH_DOCTOR } }),
            this.queueRepository.count({ where: { status: queue_entity_1.QueueStatus.COMPLETED } }),
            this.queueRepository.count({ where: { status: queue_entity_1.QueueStatus.CANCELLED } }),
        ]);
        return {
            waiting,
            withDoctor,
            completed,
            cancelled,
            total: waiting + withDoctor + completed + cancelled,
        };
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(queue_entity_1.Queue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QueueService);
//# sourceMappingURL=queue.service.js.map