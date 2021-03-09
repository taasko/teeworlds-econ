"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwConsoleMessage = void 0;
class TwConsoleMessage {
    constructor(text) {
        this.id = Date.now() + "-" + Math.random();
        this.createdAt = new Date();
        this.text = text;
    }
}
exports.TwConsoleMessage = TwConsoleMessage;
