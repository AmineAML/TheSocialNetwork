export class UpdateUserDto {
    first_name: string;
    last_name: string;
    description: string;
    address: string;
    delivery_region: string[];
    phone_number: string;
    category: number[];
    gender: string[];
    role: string;
}