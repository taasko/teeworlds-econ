"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwChatMessage = void 0;
class TwChatMessage {
    constructor(type, text, clientId, clientName) {
        this.id = Date.now() + Math.random();
        this.createdAt = new Date();
        this.type = type;
        this.text = text;
        this.clientId = clientId;
        this.clientName = clientName;
    }
}
exports.TwChatMessage = TwChatMessage;
