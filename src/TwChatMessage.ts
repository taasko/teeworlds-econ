
export class TwChatMessage {
    id: number;
    createdAt: Date;
    type: string;
    text: string;
    clientId: number;
    clientName: string;

    constructor(type: string, text: string, clientId: number, clientName: string) {
        this.id = Date.now() + Math.random();
        this.createdAt = new Date();
        this.type = type;
        this.text = text;
        this.clientId = clientId;
        this.clientName = clientName;
    }
}
