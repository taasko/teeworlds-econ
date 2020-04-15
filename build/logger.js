"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debugFunc = require("debug");
exports.default = (namespace) => {
    const log = debugFunc(namespace);
    /* tslint:disable-next-line */
    log.log = console.log.bind(console); // don't forget to bind to console!
    return {
        debug: log,
        error: debugFunc(namespace),
    };
};
//# sourceMappingURL=logger.js.map