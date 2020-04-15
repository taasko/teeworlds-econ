"use strict";
// Regexes for matching different events in econ log
Object.defineProperty(exports, "__esModule", { value: true });
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
// Regex for detecting a line with an event that we want to detect
exports.EVENT_LINE_REGEX = new RegExp(/\[(?<eventType>[^\].]*)\]:\W?(?<eventData>.*)/);
// Regexes for matching data from specific econ events
exports.EVENT_HANDLERS = {
    "generic": [
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
    "register": [
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
    "econ": [
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
    "server": [
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
    "chat": [
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
    "teamchat": [
        {
            name: "teamchat",
            regex: exports.CHAT_REGEX,
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    "whisper": [
        {
            name: "whisper",
            regex: exports.CHAT_REGEX,
            transforms: DEFAULT_TRANSFORMS,
        },
    ],
    "game": [
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
//# sourceMappingURL=events.js.map