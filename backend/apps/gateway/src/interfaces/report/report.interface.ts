export interface IReport {
    id: string;
    by_user_id: string;
    reported_user_id: string;
    description: string;
    status: "opened" | "closed"
}