"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const eventemitter2_1 = require("eventemitter2");
const logger_1 = require("./utils/logger");
const events_1 = require("./utils/events");
// class TwCommandTransaction {
//
// }
//
//     "echo \"begin #{@id}\"; #{@command}; echo \"end #{@id}\""
const log = logger_1.default("tw:TwEconConnection");
class TwEconConnection extends eventemitter2_1.EventEmitter2 {
    constructor(host, port, password, useDefaultHandlers = true) {
        super();
        this.encoding = "utf-8";
        this.reconnectDelay = 2000;
        this.host = host;
        this.port = port;
        this.password = password;
        this.useDefaultHandlers = useDefaultHandlers;
        this.reconnectDelay = 2000;
    }
    async connect() {
        this.createSocket();
        this.socket.connect({
            host: this.host,
            port: this.port,
        });
    }
    async reconnect() {
        // TODO: exponential backoff
        log.debug("RECONNECTING");
        this.socket.connect({
            host: this.host,
            port: this.port,
        });
    }
    createSocket() {
        this.socket = new net_1.Socket();
        log.debug("socket", this.socket);
        log.debug("socket id", this.socket.id);
        // this.socket.setKeepAlive(true);
        this.buffer = Buffer.from("");
        // Handle reading from socket
        this.socket.on("data", (data) => {
            this.buffer = Buffer.concat([this.buffer, data]);
            this.processBuffer();
        });
        // Handle closed socket
        this.socket.on("close", (data) => {
            log.debug("EVENT: close", data);
            // this.socket.destroy();
            setTimeout(() => this.reconnect(), this.reconnectDelay);
        });
        // Handle errors
        this.socket.on("error", (data) => {
            log.debug("EVENT: error", data);
        });
        if (this.useDefaultHandlers) {
            // Handle authentication
            this.on("generic.password_request", (event, data) => {
                this.send(this.password);
            });
        }
    }
    processBuffer() {
        const separator = "\n";
        let index = this.buffer.indexOf(separator, 0, this.encoding);
        while (index !== -1) {
            const line = this.buffer.slice(0, index);
            this.buffer = this.buffer.slice(index + separator.length);
            index = this.buffer.indexOf(separator, 0, this.encoding);
            this.processLine(line.toString().replace(/\0/g, ""));
        }
    }
    processLine(line) {
        const match = line.match(events_1.EVENT_LINE_REGEX);
        let eventType;
        let eventData;
        if (match && match.length > 2) {
            eventType = match[1];
            eventData = match[2];
        }
        else {
            eventType = "generic";
            eventData = line;
        }
        const handlers = events_1.EVENT_HANDLERS[eventType];
        let matched = false;
        if (handlers) {
            for (const handler of handlers) {
                const matches = eventData.match(handler.regex);
                if (matches) {
                    const eventParams = Object.assign({}, matches.groups);
                    log.debug(eventType + "." + handler.name, eventParams);
                    this.emit(eventType + "." + handler.name, eventParams);
                    matched = true;
                    break;
                }
            }
        }
        if (!matched) {
            log.error('[UNKNOWN]: "' + line + '"');
        }
    }
    send(data) {
        log.debug("SENDING:", data);
        this.socket.write(data + "\n", "utf-8");
    }
}
exports.TwEconConnection = TwEconConnection;
//# sourceMappingURL=TwEconConnection.js.map