# Teeworlds Econ API

With Teeworlds Econ API you can intereact with Teeworlds via its Econ cosole.
This lets you conveniently react to any events on the server as well as send
commands to it and respond to the results. The `TwEconCLient` provodes a basic
API for interaction, listening to events and sending commands. `TwStateManager`
on the other hand is a higher level abstraction that keeps track of server
state and game state as well as some other things.


## Prerequisites

To use this you need a Teeworlds server with econ enabled. To enable it add the
following to your Teeworlds server config:

```
ec_port [port]
ec_password [password]
```

If you plan on connecting to econ from a different machine than the Teeworlds
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

econ.connect();
```


## Developing 

```
yarn install
yarn dev
```
