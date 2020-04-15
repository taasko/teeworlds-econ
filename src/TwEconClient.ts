import { Socket } from "net";
import { EventEmitter2 } from "eventemitter2";

import logger from "./utils/logger";
import { EVENT_HANDLERS, EVENT_LINE_REGEX } from "./constants";
import { TwEconEvent } from "./TwEconEvent";
import { TwConsoleMessage } from "./TwConsoleMessage";


const log = logger("tw:TwEconClient");

export class TwEconClient extends EventEmitter2 {
    host: string;
    port: number;
    password: string;
    socket: any;
    buffer: Buffer; // Buffer for received data
    encoding: "utf-8" = "utf-8";
    useDefaultHandlers: boolean;
    reconnectDelay: number = 2000;

    constructor(
        host: string,
        port: number,
        password: string,
        useDefaultHandlers = true,
    ) {
        super();
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
        // TODO: exponential backoff (delay reconnection when reconnecting fails)
        log.debug("Reconnecting...");
        this.socket.connect({
            host: this.host,
            port: this.port,
        });
    }

    createSocket() {
        this.socket = new Socket();

        this.buffer = Buffer.from("");

        // Handle reading from socket
        this.socket.on("data", (data: any) => {
            this.buffer = Buffer.concat([this.buffer, data]);
            this.processBuffer();
        });

        // Handle closed socket
        this.socket.on("close", (data: any) => {
            log.debug("Socket closed.", data);
            // this.socket.destroy();
            setTimeout(() => this.reconnect(), this.reconnectDelay);
        });

        // Handle errors
        this.socket.on("error", (data: any) => {
            log.debug("Socket errored:", data);
        });

        this.socket.on("connected", (data: any) => {
            log.debug("Socket connected.");
            this.emit("socket.connected");
        });

        if (this.useDefaultHandlers) {
            // Handle authentication
            this.on("generic.password_request", (event, data) => {
                this.send(this.password);
            });

            // Handle authentication
            this.on("econ.authenticated", (event, data) => {
                this.send("status");
            });
        }
    }

    processBuffer() {
        /*
        Look for full lines of data sparated by a new line and process them.
        */
        const separator = "\n";
        let index = this.buffer.indexOf(separator, 0, this.encoding);

        while (index !== -1) {
            const line = this.buffer.slice(0, index);
            this.buffer = this.buffer.slice(index + separator.length);
            index = this.buffer.indexOf(separator, 0, this.encoding);
            this.processLine(line.toString().replace(/\0/g, ""));
        }
    }

    processLine(line: string) {
        // Handle a message received from the TW server
        // Look for lines that have a named event type and event data
        const match = line.match(EVENT_LINE_REGEX);
        let eventType;

        let eventData;

        // If line was matched, set the name and data
        if (match && match.groups && match.groups.eventType && match.groups.eventData) {
            eventType = match.groups.eventType.toLowerCase();
            eventData = match.groups.eventData.toLowerCase();
        } else {
            eventType = "generic";
            eventData = line;
        }

        // Find all handler regexes for this event type
        const handlers = EVENT_HANDLERS[eventType];
        let matched = false;

        if (handlers) {
            for (const handler of handlers) {
                // Check line against each handler, break loop if any one of them matches
                const matches = eventData.match(handler.regex);

                if (matches) {
                    // Get event parameters from regex match groups
                    const eventParams: TwEconEvent = { ...matches.groups } as any;

                    // Apply data type transformations to event parameters
                    if (handler.transforms) {
                        Object.keys(eventParams).forEach((key) => {
                            if (handler.transforms[key] !== undefined) {
                                eventParams[key] = handler.transforms[key](eventParams[key]);
                            }
                        });
                    }

                    this.emit(eventType + "." + handler.name, eventParams as TwEconEvent);
                    matched = true;
                    break;
                }
            }
        }

        if (!matched) {
            log.error('UNKNOWN LINE: "' + line + '"');
        }

        // Emit a receive event for each received line
        const consoleMessage = new TwConsoleMessage(line);
        this.emit("socket.receive", consoleMessage);
    }

    send(data: string) {
        // Send data to econ (usually commands)
        this.socket.write(data + "\n", "utf-8");
    }

    transaction(command: string) {
        /*
        Send a command and return each reply line outputted by the command via
        a Promise. Will reject if response is not received within 2 seconds.
        */
        const id = Date.now() + Math.random();
        const data = `echo "begin ${id}"; ${command}; echo "end ${id}"`;
        const lines: any = [];
        const timeout = 2000;
        let started = false;

        // Create the Promise, listen for output and run the command.
        const promise = new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject("Transaction timed out"), timeout);

            const listener = (consoleMessage: any) => {
                const text = consoleMessage.text;
                if (text === `[Console]: begin ${id}`) {
                    started = true;
                    return;
                }
                if (text === `[Console]: end ${id}`) {
                    clearTimeout(timeoutId);
                    resolve(lines);
                    return;
                }
                if (started && text.startsWith("[Console]:")) {
                    lines.push(text);
                }
            };

            this.on("socket.receive", listener);
            this.send(data);
        });

        return promise;
    }

    getSetting(name: string) {
        // Convenience transaction wrapper that returns the value of a server setting.
        return this.transaction(name).then((lines: any) => {
            const start = "[Console]: Value: ";
            for (const line of lines) {
                if (line.startsWith(start)) {
                    const data = line.substr(start.length);
                    return data;
                }
            }

            return null;
        });
    }
}
