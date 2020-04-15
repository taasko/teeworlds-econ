"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TwClient {
    constructor(clientId) {
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
exports.TwClient = TwClient;
//# sourceMappingURL=TwClient.js.map