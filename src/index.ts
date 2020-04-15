import { TwEconClient } from "./TwEconClient";

const host = "localhost";
const port = 8765;
const password = "";
const econ = new TwEconClient(host, port, password);

econ.on("game.start", (event) => {
    console.log(event);
});

econ.connect();
