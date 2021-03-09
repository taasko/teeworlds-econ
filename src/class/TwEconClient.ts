import { Socket } from "net";
import { EventEmitter2 } from "eventemitter2";

import logger from "../utils/logger";
import { EVENT_HANDLERS, EVENT_LINE_REGEX } from "../constants";
import { TwEconEvent } from "./TwEconEvent";
import { TwConsoleMessage } from "./TwConsoleMessage";


const log = logger("tw:TwEconClient");

export class TwEconClient extends EventEmitter2 {
    host: string;
    port: number;
    password: string;
    socket: Socket | undefined;
    buffer: Buffer = Buffer.from("");; // Buffer for received data
    encoding: "utf-8" = "utf-8";
    useDefaultHandlers: boolean;
    reconnectDelay: number = 2000;
    connected: boolean = false;

    constructor(
        host?: string,
        port?: number,
        password?: string,
        useDefaultHandlers = true,
    ) {
        super();
        this.host = host || "";
        this.port = port || 0;
        this.password = password || "";
        this.useDefaultHandlers = useDefaultHandlers;
        this.reconnectDelay = 2000;
        this.setMaxListeners(100);
    }

    setServer(host: string, port: number, password: string) {
        log.debug("setServer");
        this.host = host;
        this.port = port;
        this.password = password;
    }

    async connect() {
        log.debug("connect");
        if (this.socket) {
            this.socket.destroy();
        }

        if (!this.host || !this.port) {
            throw Error("Host or port is missing.");
        }

        this.createSocket();
        // @ts-ignore - "Object is possibly 'undefined'." isn't relevant as the socket is created by `createSocket`
        this.socket.connect({
            host: this.host,
            port: this.port,
        });
    }

    disconnect() {
        log.debug("disconnect");
        this.socket && this.socket.destroy()
    }

    // FIXME: implement automatic reconnect
    // async reconnect() {
    //     log.debug("reconnect");

    //     if (!this.socket) {
    //         log.warn("no socket to reconnect to!");
    //         return;
    //     }

    //     this.socket.connect({
    //         host: this.host,
    //         port: this.port,
    //     });
    // }

    createSocket() {
        log.debug("createSocket");
        this.socket = new Socket();

        this.buffer = Buffer.from("");

        // Handle reading from socket
        this.socket.on("data", (data: any) => {
            this.buffer = Buffer.concat([this.buffer, data]);
            this.processBuffer();
        });

        // Handle closed socket
        // FIXME: don't reconnect if connection closed on purpose, only if it errors
        // this.socket.on("close", (data: any) => {
        //     log.debug("Socket closed.", data);
        //     this.connected = false;
        //     setTimeout(() => this.reconnect(), this.reconnectDelay);
        // });

        // Handle errors
        this.socket.on("error", (data: any) => {
            this.connected = false;
            log.debug("Socket errored:", data);
        });

        this.socket.on("connected", (data: any) => {
            this.connected = true;
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
            eventData = match.groups.eventData;
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
                                // FIXME: remove ignore
                                // @ts-ignore
                                eventParams[key] = handler.transforms[key](eventParams[key]);
                            }
                        });
                    }

                    this.processEvent(eventType, handler.name, eventParams as TwEconEvent)
                    matched = true;
                    break;
                }
            }
        }

        if (!matched) {
            log.warn(`UNKNOWN LINE: "${line}"`);
        }

        // Emit a receive event for each received line
        const consoleMessage = new TwConsoleMessage(line);
        this.emit("socket.receive", consoleMessage);
    }

    processEvent(eventType: string, eventName: string, eventParams: TwEconEvent) {
        log.debug("EVENT:", eventType + "." + eventName, eventParams);
        this.emit(eventType + "." + eventName, eventParams);
    }

    send(data: string) {
        // Send data to econ (usually commands)

        if (!this.socket) {
            log.warn("no socket to send data to!");
            return;
        }

        this.socket.write(data + "\n", "utf-8");
    }

    transaction(command: string) {
        log.debug("transaction", command)
        /*
        Send a command and return each reply line outputted by the command via
        a Promise. Will reject if response is not received within 2 seconds.
        */
        const id = Date.now() + "-" + Math.random();
        const data = `echo "transaction_begin ${id}"; ${command}; echo "transaction_end ${id}"`;
        const lines: any = [];
        const timeout = 2000;
        let started = false;

        // Create the Promise, listen for output and run the command.
        const promise = new Promise((resolve, reject) => {
            const listenBegin = (event: any) => {
                if (event.id === id) {
                    started = true;
                }
            };

            const listenEnd = (event: any) => {
                if (event.id === id) {
                    clearListeners();
                    clearTimeout(timeoutId);
                    resolve(lines);
                }
            };

            const listenValue = (value: any) => {
                if (started) {
                    lines.push(value);
                }
            };

            const timeoutId = setTimeout(() => {
                log.warn("transaction timed out!", command)
                clearListeners();
                reject("Transaction timed out")
            }, timeout);

            const clearListeners = () => {
                this.removeListener("console.transaction_begin", listenBegin);
                this.removeListener("console.transaction_end", listenEnd);
                this.removeListener("console.value", listenValue);
            }

            this.on("console.transaction_begin", listenBegin);
            this.on("console.transaction_end", listenEnd);
            this.on("console.value", listenValue);

            this.send(data);
        });

        return promise;
    }

    getSetting(name: string) {
        // Convenience transaction wrapper that returns the value of a server setting.
        return this.transaction(name).then((lines: any) => {
            if (lines.length) {
                return lines[0].data
            }

            return null;
        });
    }
}
