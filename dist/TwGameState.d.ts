import { TwClient } from "./TwClient";
export declare class TwGameState {
    startTime: Date | null;
    clients: TwClient[];
    constructor();
    getClient(id: number): TwClient | undefined;
    getClientById(id: number): TwClient | undefined;
}
