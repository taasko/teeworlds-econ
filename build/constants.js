"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_HANDLERS = exports.EVENT_LINE_REGEX = exports.CHAT_REGEX = exports.TW_SETTINGS = exports.WEAPONS = exports.PICKUPS = exports.TEAMS = void 0;
exports.TEAMS = {
    SPECTATE: -1,
    RED: 0,
    BLUE: 1,
};
exports.PICKUPS = {
    HEART: 0,
    SHIELD: 1,
    GRENADE_LAUNCHER: 2,
    SHOTGUN: 3,
    LASER: 4,
    KATANA: 5,
};
exports.WEAPONS = {
    TEAM_SWITCH: -3,
    DEATHTILE: -1,
    HAMMER: 0,
    PISTOL: 1,
    SHOTGUN: 2,
    GRENADE_LAUNCHER: 3,
    LASER: 4,
    KATANA: 4,
};
// Teeworlds Settings Defaults
exports.TW_SETTINGS = [
    {
        id: "sv_warmup",
        name: "Warmup",
        description: "Warmup time between rounds",
        default: "0",
        type: "number",
    },
    {
        id: "sv_scorelimit",
        name: "Score limit",
        description: "Score limit of the game (0 disables it)",
        default: "20",
        type: "number",
    },
    {
        id: "sv_timelimit",
        name: "Time limit",
        description: "Time limit of the game (in case of equal points there will be sudden death)",
        default: "0",
        type: "number",
    },
    {
        id: "sv_gametype",
        name: "Game type",
        description: "Gametype (DM/CTF/TDM/LMS/LTS) (This setting needs the map to be reloaded in order to take effect)",
        default: "dm",
        type: "choice",
        choices: [
            { value: "dm", name: "DM" },
            { value: "ctf", name: "CTF" },
            { value: "tdm", name: "TDM" },
            { value: "lms", name: "LMS" },
            { value: "lts", name: "LTS" },
        ],
    },
    {
        id: "sv_maprotation",
        name: "Map rotation",
        description: "The maps to be rotated",
        default: "",
        type: "text",
    },
    {
        id: "sv_matches_per_round",
        name: "Matches per map",
        description: "Number of rounds before changing to next map in rotation",
        default: "1",
        type: "number",
    },
    {
        id: "sv_motd",
        name: "MOTD",
        description: "Message of the day, shown in server info and when joining a server",
        default: "",
        type: "text",
    },
    {
        id: "sv_player_slots",
        name: "Player slots",
        description: 'Number of slots to reserve for players. Replaces "svspectatorslots"',
        default: "8",
        type: "number",
    },
    {
        id: "sv_teambalance_time",
        name: "Teambalance time",
        description: "Time in minutes after the teams are uneven, to auto balance",
        default: "1",
        type: "number",
    },
    {
        id: "sv_spamprotection",
        name: "Spam protection",
        description: "Enable spam filter",
        default: "1",
        type: "boolean",
    },
    {
        id: "sv_tournament_mode",
        name: "Tournament mode",
        description: "Players will automatically join as spectator",
        default: "0",
        type: "boolean",
    },
    {
        id: "sv_player_ready_mode",
        name: "Player ready mode",
        description: "When enabled, players can pause/unpause the game and start the game on warmup via their ready state",
        default: "0",
        type: "boolean",
    },
    {
        id: "sv_strict_spectate_mode",
        name: "Strict spectate mode",
        description: "Restricts information like health, ammo and armour in spectator mode",
        default: "0",
        type: "boolean",
    },
    {
        id: "sv_silent_spectator_mode",
        name: "Silent spectator mode",
        description: "Mute join/leave message of spectator",
        default: "1",
        type: "boolean",
    },
    {
        id: "sv_skill_level",
        name: "Skill level",
        description: "Skill level shown in serverbrowser (0 = casual, 1 = normal, 2 = competitive)",
        default: "1",
        type: "choice",
        choices: [
            { value: 0, name: "Casual" },
            { value: 1, name: "Normal" },
            { value: 2, name: "Competitive" },
        ],
    },
    {
        id: "sv_respawn_delay_tdm",
        name: "Respawn delay tdm",
        description: "Time needed to respawn after death in tdm gametype",
        default: "3",
        type: "number",
    },
    {
        id: "sv_teamdamage",
        name: "Teamdamage",
        description: "Enable friendly fire",
        default: "0",
        type: "boolean",
    },
    {
        id: "sv_powerups",
        name: "Powerups",
        description: "Enable powerups (katana)",
        default: "1",
        type: "boolean",
    },
    {
        id: "sv_vote_kick",
        name: "Vote kick",
        description: "Enable kick voting",
        default: "1",
        type: "boolean",
    },
    {
        id: "sv_vote_kick_bantime",
        name: "Vote kick bantime",
        description: "Time in minutes to ban a player if kicked by voting (0 equals only kick)",
        default: "5",
        type: "number",
    },
    {
        id: "sv_vote_kick_min",
        name: "Vote kick min",
        description: "Minimum number of players required to start a kick vote",
        default: "0",
        type: "number",
    },
    {
        id: "sv_inactivekick_time",
        name: "Inactive kick time",
        description: "Time in minutes after an inactive player will be taken care of",
        default: "3",
        type: "number",
    },
    {
        id: "sv_inactivekick",
        name: "Inactive kick",
        description: "How to deal with inactive players (0 = move to spectator, 1 = move to free spectator slot/kick, 2 = kick)",
        default: "1",
        type: "choice",
        choices: [
            { value: 0, name: "Move to spectator" },
            { value: 1, name: "Move to free spectator slot/kick" },
            { value: 2, name: "Kick" },
        ],
    },
    {
        id: "sv_vote_spectate",
        name: "Vote spectate",
        description: "Allow voting to move players to spectators",
        default: "1",
        type: "boolean",
    },
    {
        id: "sv_vote_spectate_rejoindelay",
        name: "Vote spectate rejoindelay",
        description: "How many minutes to wait before a player can rejoin after being moved to spectators by vote",
        default: "3",
        type: "number",
    },
];
// Functions to transform a regex match to a different data type. These could
// be any functions but currently we only need to convert to numbers.
const DEFAULT_TRANSFORMS = {
    port: Number,
    clientId: Number,
    teamId: Number,
    victimId: Number,
    itemId: Number,
    weaponId: Number,
    redCount: Number,
    blueCount: Number,
    special: Number,
};
// Regex for chat messages
exports.CHAT_REGEX = new RegExp(/(?<clientId>\d{1,2}):(?<UNKNOWN>\d{1,2}):(?<clientName>.*): (?<text>.*)/);
// Regex for detecting a line with an event that we want to handle
exports.EVENT_LINE_REGEX = new RegExp(/\[(?<eventType>[^\].]*)\]:\W?(?<eventData>.*)/);
// Regexes for matching data from specific econ events
exports.EVENT_HANDLERS = {
    generic: [
        {
            name: "password_request",
            regex: new RegExp(/Enter password:/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "wrong_password",
            regex: new RegExp(/Wrong password/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "too_many_auth_attempts",
            regex: new RegExp(/Too many authentication tries/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "authentication_timeout",
            regex: new RegExp(/authentication timeout/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "authenticated",
            regex: new RegExp(/Authentication successful. External console access granted./),
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    register: [
        {
            name: "refreshing_ip_addresses",
            regex: new RegExp(/refreshing ip addresses/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "fetching_server_counts",
            regex: new RegExp(/fetching server counts/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "sending_heartbeats",
            regex: new RegExp(/chose '(?<server>.+)' as master, sending heartbeats/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "firewall_nat_ok",
            regex: new RegExp(/no firewall\/nat problems detected/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "server_registered",
            regex: new RegExp(/server registered/),
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    econ: [
        {
            name: "authenticated",
            regex: new RegExp(/cid=(?<clientId>\d{1,2}) authed/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "client_dropped",
            regex: new RegExp(/client dropped\. cid=(?<clientId>\d{1,2}) addr=(?<ip>\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}):(?<port>\d{2,5}) reason='(?<reason>.*)'/),
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    server: [
        {
            name: "player_ready",
            regex: new RegExp(/player is ready\. ClientID=(?<clientId>\d{1,2}) addr=(?<ip>\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}):(?<port>\d{2,5})/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "client_dropped",
            regex: new RegExp(/client dropped\. cid=(?<clientId>\d{1,2}) addr=(?<ip>\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}):(?<port>\d{2,5}) reason='(?<reason>.*)'/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "player_entered",
            regex: new RegExp(/player has entered the game\. ClientID=(?<clientId>\d{1,2}) addr=(?<ip>\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}):(?<port>\d{2,5})/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            // TODO: report if user is admin. Such messages have ` (Admin)` at the end.
            name: "player_info",
            regex: new RegExp(/id=(?<clientId>\d{1,2}) addr=(?<ip>\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}):(?<port>\d{2,5}) client=(?<clientVersion>\d{1,4}) name='(?<clientName>.+)'/),
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    chat: [
        {
            name: "chat",
            regex: exports.CHAT_REGEX,
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "remote",
            regex: new RegExp(/\*\*\* (?<text>.*)/),
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    teamchat: [
        {
            name: "teamchat",
            regex: exports.CHAT_REGEX,
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    whisper: [
        {
            name: "whisper",
            regex: exports.CHAT_REGEX,
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    game: [
        {
            name: "start",
            regex: new RegExp(/start match type='(?<matchType>.*)' teamplay='(?<teamplay>\d{1,2})'/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "balancing_teams",
            regex: new RegExp(/Balancing teams/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "rotating_map",
            regex: new RegExp(/rotating map to (?<mapName>.*)/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            // New team join format
            name: "team_join",
            regex: new RegExp(/team_join player='(?<clientId>\d{1,2}):(?<clientName>.*)' m?_?T?t?eam=(?<fromTeamId>-?\d+)->(?<teamId>-?\d+)/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            // Old team join format
            name: "team_join",
            regex: new RegExp(/team_join player='(?<clientId>\d{1,2}):(?<clientName>.*)' m?_?T?t?eam=(?<teamId>-?\d+)/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "pickup",
            regex: new RegExp(/pickup player='(?<clientId>\d{1,2}):(?<clientName>.*)' item=(?<itemId>\d+)/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "flag_grab",
            regex: new RegExp(/flag_grab player='(?<clientId>\d{1,2}):(?<clientName>.*)'/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "flag_return",
            regex: new RegExp(/flag_return player='(?<clientId>\d{1,2}):(?<clientName>.*)'/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "flag_return",
            regex: new RegExp(/flag_return$/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "flag_capture",
            regex: new RegExp(/flag_capture player='(?<clientId>\d{1,2}):(?<clientName>.*)'/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "leave",
            regex: new RegExp(/leave player='(?<clientId>\d{1,2}):(?<clientName>.*)'/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "kill",
            regex: new RegExp(/kill killer='(?<clientId>\d{1,2}):(?<clientName>.*)' victim='(?<victimId>\d{1,2}):(?<victimName>.*)' weapon=(?<weaponId>-?\d+) special=(?<special>-?\d+)/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "teams_balanced",
            regex: new RegExp(/Teams are balanced \((red=(?<redCount>\d{1,2}) blue=(?<blueCount>\d{1,2}))\)/),
            transforms: DEFAULT_TRANSFORMS,
        },
        {
            name: "teams_not_balanced",
            regex: new RegExp(/Teams are NOT balanced \((red=(?<redCount>\d{1,2}) blue=(?<blueCount>\d{1,2}))\)/),
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
};
