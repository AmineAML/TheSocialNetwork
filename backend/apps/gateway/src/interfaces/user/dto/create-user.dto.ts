export class CreateUserDto {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    description: string;
    intersts: string[];
    gender: string;
    role: string;
    social_media: any;
}