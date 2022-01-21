"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TwEconClient_1 = require("./TwEconClient");
const host = "localhost";
const port = 8765;
const password = "";
const econ = new TwEconClient_1.TwEconClient(host, port, password);
econ.on("game.start", (event) => {
    console.log(event);
});
econ.connect();
