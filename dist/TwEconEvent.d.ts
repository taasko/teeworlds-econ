export interface TwEconEvent {
    ip: string;
    port: number;
    clientId: number;
    clientName: string;
    clientVersion: string;
    text: string;
    server: string;
    reason: string;
    matchType: string;
    teamplay: string;
    mapName: string;
    teamId: number;
    fromTeamId: number;
    itemId: number;
    victimId: number;
    victimName: string;
    weaponId: number;
    special: number;
    redCount: number;
    blueCount: number;
}
