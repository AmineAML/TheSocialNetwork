import { Document } from 'mongoose';

export interface IReport extends Document {
    id?: string;
    by_user_id: string;
    reported_user_id: string;
    description: string;
    status: "opened" | "closed"
}