export declare class TwChatMessage {
    id: number;
    createdAt: Date;
    type: string;
    text: string;
    clientId: number;
    clientName: string;
    constructor(type: string, text: string, clientId: number, clientName: string);
}
