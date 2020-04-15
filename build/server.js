"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./utils/logger");
const log = logger_1.default("tw:websocket");
const socketio = require("socket.io");
function initTwApi(app, httpServer, econ, stateManager) {
    // TODO: check origins security
    const io = socketio(httpServer, { origins: "*:*" });
    // When data comes in to econ relay it to all clients
    // TODO: unbind listeners, soomething is sending duplicate events
    econ.on("socket.receive", (consoleMessage) => {
        io.emit("socket.receive", consoleMessage);
    });
    // Send states when they change
    stateManager.on("chat.message", (message) => {
        console.log("emitting chat");
        io.emit("chat.message", message);
    });
    io.on("connection", (socket) => {
        // When client connects bind events and send initial state
        log.debug("Client connected");
        // Relay data from frontend to econ
        socket.on("socket.send", (data) => {
            econ.send(data);
        });
        // Reload settings when requested
        socket.on("state.loadSettings", (data) => {
            console.log("loadsets", stateManager.serverState.settings);
            stateManager.loadSettings();
        });
        // Send states when they change
        stateManager.on("state.change", (state) => {
            io.emit("state.change", state);
        });
        // Send initial states
        io.emit("state.change", {
            name: "gameState",
            data: stateManager.gameState,
        });
        io.emit("state.change", {
            name: "serverState",
            data: stateManager.serverState,
        });
        io.emit("state.change", {
            name: "chatMessages",
            data: stateManager.chatMessages,
        });
        io.emit("state.change", {
            name: "consoleMessages",
            data: stateManager.consoleMessages,
        });
    });
}
exports.initTwApi = initTwApi;
//# sourceMappingURL=server.js.map