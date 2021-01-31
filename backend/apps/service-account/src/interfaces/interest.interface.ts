import { Document } from 'mongoose';

export interface IInterest extends Document {
    id?: string;
    name: string;
    byNumberOfUsers: number;
}