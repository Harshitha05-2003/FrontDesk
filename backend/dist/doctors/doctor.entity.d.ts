import { Appointment } from '../appointments/appointment.entity';
export declare enum DoctorSpecialization {
    GENERAL = "general",
    CARDIOLOGY = "cardiology",
    DERMATOLOGY = "dermatology",
    ORTHOPEDICS = "orthopedics",
    PEDIATRICS = "pediatrics",
    NEUROLOGY = "neurology",
    PSYCHIATRY = "psychiatry",
    SURGERY = "surgery"
}
export declare enum DoctorGender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare class Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialization: DoctorSpecialization;
    gender: DoctorGender;
    location: string;
    description: string;
    isAvailable: boolean;
    availability: {
        monday: {
            start: string;
            end: string;
            available: boolean;
        };
        tuesday: {
            start: string;
            end: string;
            available: boolean;
        };
        wednesday: {
            start: string;
            end: string;
            available: boolean;
        };
        thursday: {
            start: string;
            end: string;
            available: boolean;
        };
        friday: {
            start: string;
            end: string;
            available: boolean;
        };
        saturday: {
            start: string;
            end: string;
            available: boolean;
        };
        sunday: {
            start: string;
            end: string;
            available: boolean;
        };
    };
    appointments: Appointment[];
    createdAt: Date;
    updatedAt: Date;
}
