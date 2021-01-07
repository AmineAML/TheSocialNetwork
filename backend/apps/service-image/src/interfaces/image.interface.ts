import { Document } from 'mongoose';

export interface IImage extends Document {
    id?: string;
    link: string;
    //Meaning avatar ir background
    type: string;
    user_id: string;
    imagekit_file_id: string;
}