import { AuthService } from './auth.service';
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    test(): {
        message: string;
    };
    getProfile(req: any): any;
}
