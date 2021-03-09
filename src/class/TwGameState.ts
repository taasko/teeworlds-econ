import { TwClient } from "./TwClient";


export class TwGameState {
    startTime: Date | null = null;
    clients: TwClient[] = [];

    constructor() {
        return;
    }

    getClient(id: number) {
        return this.getClientById(id);
    }

    getClientById(id: number) {
        return this.clients.find(client => client.clientId === id);
    }
}
