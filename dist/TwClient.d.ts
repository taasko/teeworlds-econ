export declare class TwClient {
    ip: string;
    port: number;
    clientId: number;
    clientName: string;
    clientVersion: string;
    createdAt: Date;
    teamId: number;
    stats: {
        score: number;
        total: {
            kills: number;
            deaths: number;
            grabs: number;
            captures: number;
        };
        streak: {
            kills: number;
            grabs: number;
            captures: number;
        };
    };
    constructor(clientId: number);
    toString(): string;
    resetStats(): void;
    resetStreaks(): void;
}
