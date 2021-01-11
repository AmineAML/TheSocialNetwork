import { Document } from 'mongoose';

export interface IToken extends Document {
    //Don't include user_id name, better sub meaning user id
    user_id: string;
    access_token: string;
    refresh_token: string;
}