import { EventEmitter2 } from "eventemitter2";

import logger from "./utils/logger";
const log = logger("tw:TwGameStateManager");

import { TwEconClient } from "./TwEconClient";
import { TwServerState } from "./TwServerState";
import { TwGameState } from "./TwGameState";
import { TwChatMessage } from "./TwChatMessage";
import { TwConsoleMessage } from "./TwConsoleMessage";
import { TwClient } from "./TwClient";
import { TwEconEvent } from "./TwEconEvent";


const MAX_CONSOLE_MESSAGES = 1000;
const MAX_CHAT_MESSAGES = 1000;

export class TwStateManager extends EventEmitter2 {
    econClient: TwEconClient;
    serverState: TwServerState;
    gameState: TwGameState;
    chatMessages: TwChatMessage[];
    consoleMessages: TwConsoleMessage[];

    constructor(econClient: TwEconClient) {
        super();
        this.econClient = econClient;
        this.serverState = new TwServerState();
        this.gameState = new TwGameState();
        this.consoleMessages = [];
        this.chatMessages = [];
    }

    getOrCreateClient(id: number) {
        let client = this.gameState.getClientById(id);

        if (!client) {
            client = new TwClient(id);
            this.gameState.clients.push(client);
        }

        return client;
    }

    onAuthenticated() {
        // Load server settings
        this.loadSettings();
    }

    onConsoleMessage(consoleMessage: any) {
        this.consoleMessages.push(consoleMessage);

        if (this.consoleMessages.length > MAX_CONSOLE_MESSAGES) {
            this.consoleMessages.shift();
        }
    }

    onChatMessage(type: string, e: TwEconEvent) {
        const chatMessage = new TwChatMessage(type, e.text, e.clientId, e.clientName);
        this.chatMessages.push(chatMessage);

        if (this.chatMessages.length > MAX_CHAT_MESSAGES) {
            this.chatMessages.shift();
        }

        this.emit("chat.message", chatMessage);
    }

    onGameStart() {
        this.gameState.clients.forEach(client => client.resetStats());
        this.gameState.startTime = new Date();
        this.gameStateChanged();
    }

    onClientJoin(e: TwEconEvent) {
        const client = this.getOrCreateClient(e.clientId);
        log.debug("playerJoin", client);
        this.gameStateChanged();
    }

    onClientInfo(e: TwEconEvent) {
        const client = this.getOrCreateClient(e.clientId);
        client.ip = e.ip;
        client.port = e.port;
        client.clientName = e.clientName;
        client.clientVersion = e.clientVersion;
        this.gameStateChanged();
    }

    onClientLeave(e: TwEconEvent) {
        log.debug("playerLeave", e);
        const client = this.gameState.getClient(e.clientId);
        if (client) {
            this.gameState.clients = this.gameState.clients.filter(
                (c: TwClient) => c.clientId !== e.clientId,
            );
            this.gameStateChanged();
        }
    }

    onTeamJoin(e: TwEconEvent) {
        const client = this.getOrCreateClient(e.clientId);
        client.teamId = e.teamId;
        client.clientName = e.clientName;
        this.gameStateChanged();
    }

    onKill(e: TwEconEvent) {
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
        } else {
            victim.resetStreaks();
            // Deduct score if death wasn't a team change
            if (e.weaponId !== -3) {
                victim.stats.score -= 1;
            }
        }
        this.gameStateChanged();
    }

    onFlagGrab(e: TwEconEvent) {
        const client = this.getOrCreateClient(e.clientId);
        client.stats.score += 1;
        client.stats.total.grabs += 1;
        client.stats.streak.grabs += 1;
        this.gameStateChanged();
    }

    onFlagReturn(e: TwEconEvent) {
        if (e.clientId) {
            const client = this.getOrCreateClient(e.clientId);
            client.stats.score += 1;
            this.gameStateChanged();
        }
    }

    onFlagCapture(e: TwEconEvent) {
        const client = this.getOrCreateClient(e.clientId);
        client.stats.score += 5;
        client.stats.total.captures += 1;
        client.stats.streak.captures += 1;
        this.gameStateChanged();
    }

    bindEvents() {
        this.econClient.on("econ.authenticated", () => this.onAuthenticated());
        this.econClient.on("server.player_info", e => this.onClientInfo(e));
        this.econClient.on("server.player_ready", e => this.onClientJoin(e));
        this.econClient.on("server.client_dropped", e => this.onClientLeave(e));
        this.econClient.on("game.team_join", e => this.onTeamJoin(e));
        this.econClient.on("game.kill", e => this.onKill(e));
        this.econClient.on("game.start", () => this.onGameStart());
        this.econClient.on("game.flag_grab", e => this.onFlagGrab(e));
        this.econClient.on("game.flag_return", e => this.onFlagReturn(e));
        this.econClient.on("game.flag_capture", e => this.onFlagCapture(e));
        this.econClient.on("socket.receive", (data: any) => this.onConsoleMessage(data));

        this.econClient.on("chat.chat", (e: any) => {
            this.onChatMessage("chat", e);
        });
        this.econClient.on("teamchat.teamchat", (e: any) => {
            this.onChatMessage("teamchat", e);
        });
        this.econClient.on("whisper.whisper", (e: any) => {
            this.onChatMessage("whisper", e);
        });
        this.econClient.on("chat.remote", (e: any) => {
            this.onChatMessage("remote", e);
        });
    }

    // TODO: fix any
    async loadSettings() {
        const promises = [];

        for (const key in this.serverState.settings) {
            promises.push(
                this.econClient.getSetting(key).then(
                    (value: any) => this.serverState.settings[key] = value,
                ),
            );
        }

        Promise.all(promises).then(() => {
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
