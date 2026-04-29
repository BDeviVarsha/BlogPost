export interface Message {
    sender_Id: number;
    receiver_Id: number;
    content: string;
    timestamp?: Date;
    seen: boolean;
}
