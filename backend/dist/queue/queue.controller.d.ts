import { QueueService, CreateQueueDto, UpdateQueueDto } from './queue.service';
import { QueueStatus } from './queue.entity';
export declare class QueueController {
    private readonly queueService;
    constructor(queueService: QueueService);
    create(createQueueDto: CreateQueueDto): Promise<import("./queue.entity").Queue>;
    findAll(): Promise<import("./queue.entity").Queue[]>;
    findActive(): Promise<import("./queue.entity").Queue[]>;
    getNextInQueue(): Promise<import("./queue.entity").Queue>;
    getQueueStats(): Promise<any>;
    findByStatus(status: QueueStatus): Promise<import("./queue.entity").Queue[]>;
    findOne(id: string): Promise<import("./queue.entity").Queue>;
    update(id: string, updateQueueDto: UpdateQueueDto): Promise<import("./queue.entity").Queue>;
    updateStatus(id: string, status: QueueStatus): Promise<import("./queue.entity").Queue>;
    remove(id: string): Promise<void>;
}
