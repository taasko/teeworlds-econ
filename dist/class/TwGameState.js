"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwGameState = void 0;
class TwGameState {
    constructor() {
        this.startTime = null;
        this.clients = [];
        return;
    }
    getClient(id) {
        return this.getClientById(id);
    }
    getClientById(id) {
        return this.clients.find(client => client.clientId === id);
    }
}
exports.TwGameState = TwGameState;
