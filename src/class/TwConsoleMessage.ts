
export class TwConsoleMessage {
    id: string;
    createdAt: Date;
    text: string;

    constructor(text: string) {
        this.id = Date.now() + "-" + Math.random();
        this.createdAt = new Date();
        this.text = text;
    }
}
