/// <reference types="node" />
import { EventEmitter2 } from "eventemitter2";
export declare class TwEconClient extends EventEmitter2 {
    host: string;
    port: number;
    password: string;
    socket: any;
    buffer: Buffer;
    encoding: "utf-8";
    useDefaultHandlers: boolean;
    reconnectDelay: number;
    constructor(host: string, port: number, password: string, useDefaultHandlers?: boolean);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    reconnect(): Promise<void>;
    setServer(host: string, port: number, password: string): void;
    createSocket(): void;
    processBuffer(): void;
    processLine(line: string): void;
    send(data: string): void;
    transaction(command: string): Promise<unknown>;
    getSetting(name: string): Promise<any>;
}
