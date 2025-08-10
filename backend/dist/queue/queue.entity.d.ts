export declare enum QueueStatus {
    WAITING = "waiting",
    WITH_DOCTOR = "with_doctor",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum QueuePriority {
    NORMAL = "normal",
    URGENT = "urgent",
    VIP = "vip"
}
export declare class Queue {
    id: number;
    queueNumber: number;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    reason: string;
    status: QueueStatus;
    priority: QueuePriority;
    checkInTime: Date;
    calledTime: Date;
    completedTime: Date;
    estimatedWaitTime: number;
    createdAt: Date;
    updatedAt: Date;
}
