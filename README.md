# Teeworlds Econ API

Teeworlds Econ API is a JavaScript library that lets you intereact with
Teeworlds game servers. It works by connecting to the server via Econ
(external console). This lets you listen to any events on the server as well
as send commands to it and react to the results. The `TwEconCLient` provodes a
basic API for interaction, listening to events and sending commands.
`TwStateManager` is a higher level abstraction that keeps track of server state
and game state, settings, and stats.


## TODO:
- [ ] Handle reconnecting to server automatically if connection is dropped

## Prerequisites

To use this you need a Teeworlds server with Econ enabled. To enable it add the
following to your Teeworlds server config:

```
ec_port [port]
ec_password [password]
```

If you plan on connecting to Econ from a different machine than the Teeworlds
server itself you also need to add this to your config:

```
ec_bindaddr 0.0.0.0
```

## Usage

```
import { TwEconClient } from "./TwEconClient";

const host = "localhost"
const port = 8303
const password = "secret"

const econClient = new TwEconClient(host, port, password);

econ.on("game.start", (event) => {
    console.log(event);
});

econ.connect();
```

## Developing

```
yarn install
yarn dev
```
