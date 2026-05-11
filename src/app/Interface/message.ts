export interface Message {
    id: number;
    sender_Id: number;
    receiver_Id: number;
    content: string;
    timestamp?: Date;
    seen: boolean;
}
