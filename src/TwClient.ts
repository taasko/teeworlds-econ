
export class TwClient {
    ip: string;
    port: number;
    clientId: number;
    clientName: string;
    clientVersion: string;
    createdAt: Date;
    teamId: number;

    // Stats
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

    constructor(clientId: number) {
        this.createdAt = new Date();
        this.clientId = clientId;
        this.resetStats();
    }

    toString() {
        return `TwClient cid:${this.clientId} name:${this.clientName} teamId:${this.teamId} deaths[t]:${this.stats.total.deaths} kills[t]:${this.stats.total.kills} grabs[t]:${this.stats.total.grabs} captures[t]:${this.stats.total.captures} kills[s]:${this.stats.streak.kills} grabs[s]:${this.stats.streak.grabs} captures[s]:${this.stats.streak.captures}`;
    }

    resetStats() {
        this.stats = {
            score: 0,
            total: {
                kills: 0,
                deaths: 0,
                grabs: 0,
                captures: 0,
            },
            streak: {
                kills: 0,
                grabs: 0,
                captures: 0,
            },
        };
    }

    resetStreaks() {
        this.stats.streak = {
            kills: 0,
            grabs: 0,
            captures: 0,
        };
    }
}
