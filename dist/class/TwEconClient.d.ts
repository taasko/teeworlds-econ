/// <reference types="node" />
import { Socket } from "net";
import { EventEmitter2 } from "eventemitter2";
import { TwEconEvent } from "./TwEconEvent";
export declare class TwEconClient extends EventEmitter2 {
    host: string;
    port: number;
    password: string;
    socket: Socket | undefined;
    buffer: Buffer;
    encoding: "utf-8";
    useDefaultHandlers: boolean;
    reconnectDelay: number;
    connected: boolean;
    constructor(host?: string, port?: number, password?: string, useDefaultHandlers?: boolean);
    setServer(host: string, port: number, password: string): void;
    connect(): Promise<void>;
    disconnect(): void;
    createSocket(): void;
    processBuffer(): void;
    processLine(line: string): void;
    processEvent(eventType: string, eventName: string, eventParams: TwEconEvent): void;
    send(data: string): void;
    transaction(command: string): Promise<unknown>;
    getSetting(name: string): Promise<any>;
}
