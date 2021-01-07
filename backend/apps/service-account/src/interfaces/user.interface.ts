import { Document } from 'mongoose';

export interface IUser extends Document {
    id?: string;
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    description: string;
    intersts: string[];
    gender: string;
    role: string;
    is_confirmed: boolean;
    social_media: SocialMedia;
    compareEncryptedPassword: (password: string) => boolean;
    getEncryptedPassword: (password: string) => string;
}

interface SocialMedia {
    facebook: string;
    linkedin: string;
    twitter: string;
}