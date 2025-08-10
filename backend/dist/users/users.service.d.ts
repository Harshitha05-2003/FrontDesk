import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
export declare class CreateUserDto {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User | null>;
    remove(id: number): Promise<void>;
}
