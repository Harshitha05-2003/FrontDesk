export declare enum UserRole {
    STAFF = "staff",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
