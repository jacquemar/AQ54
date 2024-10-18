import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
    }>;
    findOne(username: string): Promise<{
        id: number;
        username: string;
        email: string;
    }>;
}
