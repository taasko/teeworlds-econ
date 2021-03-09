"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
exports.default = (namespace) => {
    const log = debug_1.default(namespace);
    /* tslint:disable-next-line */
    log.log = console.log.bind(console); // don't forget to bind to console!
    return {
        debug: log,
        warn: debug_1.default(namespace),
        error: debug_1.default(namespace),
    };
};
