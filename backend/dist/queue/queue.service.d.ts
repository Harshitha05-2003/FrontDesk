import { Repository } from 'typeorm';
import { Queue, QueueStatus, QueuePriority } from './queue.entity';
export declare class CreateQueueDto {
    patientName: string;
    patientPhone?: string;
    patientEmail?: string;
    reason?: string;
    priority?: QueuePriority;
}
export declare class UpdateQueueDto {
    patientName?: string;
    patientPhone?: string;
    patientEmail?: string;
    reason?: string;
    status?: QueueStatus;
    priority?: QueuePriority;
    estimatedWaitTime?: number;
    calledTime?: Date;
    completedTime?: Date;
}
export declare class QueueService {
    private queueRepository;
    constructor(queueRepository: Repository<Queue>);
    create(createQueueDto: CreateQueueDto): Promise<Queue>;
    findAll(): Promise<Queue[]>;
    findActive(): Promise<Queue[]>;
    findOne(id: number): Promise<Queue | null>;
    findByStatus(status: QueueStatus): Promise<Queue[]>;
    findByPriority(priority: QueuePriority): Promise<Queue[]>;
    getNextInQueue(): Promise<Queue | null>;
    update(id: number, updateQueueDto: UpdateQueueDto): Promise<Queue | null>;
    updateStatus(id: number, status: QueueStatus): Promise<Queue | null>;
    remove(id: number): Promise<void>;
    getQueueStats(): Promise<any>;
}
