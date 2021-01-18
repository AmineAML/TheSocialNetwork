export class UpdateUserDto {
    first_name: string;
    last_name: string;
    description: string;
    intersts: string[];
    gender: string;
    role: string;
    social_media: SocialMedia;
}

interface SocialMedia {
    facebook: string;
    linkedin: string;
    twitter: string;
    tiktok: string;
    discord: string;
    instagram: string;
    youtube: string;
}