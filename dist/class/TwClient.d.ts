export declare class TwClient {
    ip: string;
    port: number | undefined;
    clientId: number | undefined;
    clientName: string;
    clientVersion: string;
    createdAt: Date | undefined;
    teamId: number | undefined;
    stats: {
        score: number;
        hasFlag: boolean;
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
