"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
const logger_1 = require("./utils/logger");
const log = logger_1.default("tw:TwGameStateManager");
const TwClient_1 = require("./TwClient");
class TwGameStateManager extends eventemitter2_1.EventEmitter2 {
    constructor(gameState, econClient) {
        super();
        this.gameState = gameState;
        this.econClient = econClient;
    }
    authenticated(e) {
        this.loadSettings();
    }
    getOrCreateClient(id) {
        let client = this.gameState.getClientById(id);
        if (!client) {
            client = new TwClient_1.TwClient(id);
            this.gameState.clients.push(client);
        }
        return client;
    }
    clientJoin(e) {
        const client = this.getOrCreateClient(e.clientId);
        log.debug("playerJoin", client);
        this.stateChanged();
    }
    clientInfo(e) {
        const client = this.getOrCreateClient(e.clientId);
        client.ip = e.ip;
        client.port = e.port;
        client.clientName = e.clientName;
        client.clientVersion = e.clientVersion;
        this.stateChanged();
    }
    clientLeave(e) {
        log.debug("playerLeave", e);
        const client = this.gameState.getClient(e.clientId);
        if (client) {
            this.gameState.clients = this.gameState.clients.filter((c) => c.clientId !== e.clientId);
            this.stateChanged();
        }
    }
    teamJoin(e) {
        const client = this.getOrCreateClient(e.clientId);
        client.teamId = e.teamId;
        client.clientName = e.clientName;
        this.stateChanged();
    }
    start(e) {
        this.gameState.clients.forEach(client => client.resetStats());
        // this.loadSettings();
        this.stateChanged();
    }
    kill(e) {
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
        this.stateChanged();
    }
    flagGrab(e) {
        const client = this.getOrCreateClient(e.clientId);
        client.stats.score += 1;
        client.stats.total.grabs += 1;
        client.stats.streak.grabs += 1;
        this.stateChanged();
    }
    flagReturn(e) {
        if (e.clientId) {
            const client = this.getOrCreateClient(e.clientId);
            client.stats.score += 1;
            this.stateChanged();
        }
    }
    flagCapture(e) {
        const client = this.getOrCreateClient(e.clientId);
        client.stats.score += 5;
        client.stats.total.captures += 1;
        client.stats.streak.captures += 1;
        this.stateChanged();
    }
    bindEvents() {
        this.econClient.on("econ.authenticated", (e) => this.authenticated(e));
        this.econClient.on("server.player_info", e => this.clientInfo(e));
        this.econClient.on("server.player_ready", e => this.clientJoin(e));
        this.econClient.on("server.client_dropped", e => this.clientLeave(e));
        this.econClient.on("game.team_join", e => this.teamJoin(e));
        this.econClient.on("game.kill", e => this.kill(e));
        this.econClient.on("game.start", e => this.start(e));
        this.econClient.on("game.flag_grab", e => this.flagGrab(e));
        this.econClient.on("game.flag_return", e => this.flagReturn(e));
        this.econClient.on("game.flag_capture", e => this.flagCapture(e));
    }
    // TODO: fix any
    async loadSettings() {
        const promises = [];
        for (const key in this.gameState.settings) {
            promises.push(this.econClient.getSetting(key).then((value) => this.gameState.settings[key] = value));
        }
        Promise.all(promises).then((values) => {
            this.stateChanged();
        });
    }
    stateChanged() {
        this.emit("state.change");
    }
}
exports.TwGameStateManager = TwGameStateManager;
//# sourceMappingURL=TwGameStateManager.js.map