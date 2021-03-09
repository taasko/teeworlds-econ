export declare const TEAMS: {
    SPECTATE: number;
    RED: number;
    BLUE: number;
};
export declare const PICKUPS: {
    HEART: number;
    SHIELD: number;
    GRENADE_LAUNCHER: number;
    SHOTGUN: number;
    LASER: number;
    KATANA: number;
};
export declare const WEAPONS: {
    TEAM_SWITCH: number;
    DEATHTILE: number;
    HAMMER: number;
    PISTOL: number;
    SHOTGUN: number;
    GRENADE_LAUNCHER: number;
    LASER: number;
    KATANA: number;
};
export declare const TW_SETTINGS: ({
    id: string;
    name: string;
    description: string;
    default: string;
    type: string;
    choices?: undefined;
} | {
    id: string;
    name: string;
    description: string;
    default: string;
    type: string;
    choices: {
        value: string;
        name: string;
    }[];
} | {
    id: string;
    name: string;
    description: string;
    default: string;
    type: string;
    choices: {
        value: number;
        name: string;
    }[];
})[];
export declare const CHAT_REGEX: RegExp;
export declare const EVENT_LINE_REGEX: RegExp;
export declare const EVENT_HANDLERS: any;
