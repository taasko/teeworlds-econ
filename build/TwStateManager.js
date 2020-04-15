"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
const logger_1 = require("./utils/logger");
const log = logger_1.default("tw:TwGameStateManager");
const TwServerState_1 = require("./TwServerState");
const TwGameState_1 = require("./TwGameState");
const TwChatMessage_1 = require("./TwChatMessage");
const TwClient_1 = require("./TwClient");
const MAX_CONSOLE_MESSAGES = 1000;
const MAX_CHAT_MESSAGES = 1000;
class TwStateManager extends eventemitter2_1.EventEmitter2 {
    constructor(econClient) {
        super();
        this.econClient = econClient;
        this.serverState = new TwServerState_1.TwServerState();
        this.gameState = new TwGameState_1.TwGameState();
        this.consoleMessages = [];
        this.chatMessages = [];
    }
    getOrCreateClient(id) {
        let client = this.gameState.getClientById(id);
        if (!client) {
            client = new TwClient_1.TwClient(id);
            this.gameState.clients.push(client);
        }
        return client;
    }
    onAuthenticated(e) {
        this.loadSettings();
    }
    onConsoleMessage(consoleMessage) {
        this.consoleMessages.push(consoleMessage);
        if (this.consoleMessages.length > MAX_CONSOLE_MESSAGES) {
            this.consoleMessages.shift();
        }
    }
    onChatMessage(type, e) {
        const chatMessage = new TwChatMessage_1.TwChatMessage(type, e.text, e.clientId, e.clientName);
        this.chatMessages.push(chatMessage);
        if (this.chatMessages.length > MAX_CHAT_MESSAGES) {
            this.chatMessages.shift();
        }
        this.emit("chat.message", chatMessage);
    }
    onGameStart(e) {
        this.gameState.clients.forEach(client => client.resetStats());
        this.gameState.startTime = new Date();
        // this.loadSettings();
        this.gameStateChanged();
    }
    onClientJoin(e) {
        const client = this.getOrCreateClient(e.clientId);
        log.debug("playerJoin", client);
        this.gameStateChanged();
    }
    onClientInfo(e) {
        const client = this.getOrCreateClient(e.clientId);
        client.ip = e.ip;
        client.port = e.port;
        client.clientName = e.clientName;
        client.clientVersion = e.clientVersion;
        this.gameStateChanged();
    }
    onClientLeave(e) {
        log.debug("playerLeave", e);
        const client = this.gameState.getClient(e.clientId);
        if (client) {
            this.gameState.clients = this.gameState.clients.filter((c) => c.clientId !== e.clientId);
            this.gameStateChanged();
        }
    }
    onTeamJoin(e) {
        console.log("onTeamJoin");
        console.log(e);
        const client = this.getOrCreateClient(e.clientId);
        client.teamId = e.teamId;
        client.clientName = e.clientName;
        this.gameStateChanged();
    }
    onKill(e) {
        const killer = this.gameState.getClient(e.clientId);
        if (!killer) {
            log.debug("Killer not found kill!");
            return;
        }
        const victim = this.getOrCreateClient(e.victimId);
        // If cause of death isn't switching teams, deduct score and add death
        if (e.weaponId !== -3) {
            // victim.stats.score -= 1;
            victim.stats.total.deaths += 1;
        }
        victim.resetStreaks();
        if (killer !== victim) {
            killer.stats.total.kills += 1;
            killer.stats.streak.kills += 1;
            killer.stats.score += 1;
        }
        else {
            victim.resetStreaks();
            // Deduct score if death wasn't a team change
            if (e.weaponId !== -3) {
                victim.stats.score -= 1;
            }
        }
        this.gameStateChanged();
    }
    onFlagGrab(e) {
        const client = this.getOrCreateClient(e.clientId);
        client.stats.score += 1;
        client.stats.total.grabs += 1;
        client.stats.streak.grabs += 1;
        this.gameStateChanged();
    }
    onFlagReturn(e) {
        if (e.clientId) {
            const client = this.getOrCreateClient(e.clientId);
            client.stats.score += 1;
            this.gameStateChanged();
        }
    }
    onFlagCapture(e) {
        const client = this.getOrCreateClient(e.clientId);
        client.stats.score += 5;
        client.stats.total.captures += 1;
        client.stats.streak.captures += 1;
        this.gameStateChanged();
    }
    bindEvents() {
        this.econClient.on("econ.authenticated", (e) => this.onAuthenticated(e));
        this.econClient.on("server.player_info", e => this.onClientInfo(e));
        this.econClient.on("server.player_ready", e => this.onClientJoin(e));
        this.econClient.on("server.client_dropped", e => this.onClientLeave(e));
        this.econClient.on("game.team_join", e => this.onTeamJoin(e));
        this.econClient.on("game.kill", e => this.onKill(e));
        this.econClient.on("game.start", e => this.onGameStart(e));
        this.econClient.on("game.flag_grab", e => this.onFlagGrab(e));
        this.econClient.on("game.flag_return", e => this.onFlagReturn(e));
        this.econClient.on("game.flag_capture", e => this.onFlagCapture(e));
        this.econClient.on("socket.receive", (data) => this.onConsoleMessage(data));
        this.econClient.on("chat.chat", (e) => {
            this.onChatMessage("chat", e);
        });
        this.econClient.on("teamchat.teamchat", (e) => {
            this.onChatMessage("teamchat", e);
        });
        this.econClient.on("whisper.whisper", (e) => {
            this.onChatMessage("whisper", e);
        });
        this.econClient.on("chat.remote", (e) => {
            this.onChatMessage("remote", e);
        });
    }
    // TODO: fix any
    async loadSettings() {
        const promises = [];
        for (const key in this.serverState.settings) {
            promises.push(this.econClient.getSetting(key).then((value) => this.serverState.settings[key] = value));
        }
        Promise.all(promises).then((values) => {
            this.serverStateChanged();
        });
    }
    gameStateChanged() {
        this.emit("state.change", {
            name: "gameState",
            data: this.gameState,
        });
    }
    serverStateChanged() {
        this.emit("state.change", {
            name: "serverState",
            data: this.serverState,
        });
    }
}
exports.TwStateManager = TwStateManager;
//# sourceMappingURL=TwStateManager.js.map