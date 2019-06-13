# 401 Midterm - Nimble

## Socket Server

#### Authors: Becky, Chris, Joé, Morgana

## Links & Resources
* [GitHub Repo](https://github.com/401-advanced-javascript-nimble/socket_server)
* [Socket Server Deploylment](https://401-advanced-javascript-nimble-socket-server.azurewebsites.net)

### Documentation

### Modules
* `server.js` -- Requires **dotenv** and **socket.io** and creates a socket server instance. Reacts to a socket connection, reacts to player moves, and reacts when a user opts to disconnect.
* `game.js` -- Module that defines the Game class and related methods. Specifically, the starting amount in each stack, the **takeItemsRemaining** method to remove items from a stack, **tallyTotalItemsRemaining** to keep track of overall remaining items, and **decrement** to show the time remaining for each turn.
* `events.js` -- Module that exports an object with events the socket server will be listening for, namely, move, turn, gameOver, message, countdown, and win.
* `lib/connection_wrapper.js` -- Module that contains a curried 'start of game' function. It includes logic that keeps track of how many players are available for a game. If only one player has joined, they receive the message, 'Waiting for second player...'. If a second player joins, a new game is created. The message event 'Starting game' is sent to player one, followed by a turn event. The message event 'Starting game' is sent to player two, followed by the message event 'Waiting for player to move'.
* `lib/disconnect_wrapper.js` -- Module that contains a curried 'disconnect' function. When a player disconnects, emits a 'Player disconnected, ending game' and 'Game Over!' message to players.
* `lib/emit_wrapper.js` -- Module with logic for the emitWrapper function that takes in four parameters: **io** (the socket server instance), **event**, (the event to listen for), **payload** (usually data associated with an event), and **target** (the socket id for a specific player). If a target exists, the emitted event is sent to that specific player. Otherwise the emitted event is sent to all listening parties.
* `lib/game_cycle.js` -- Module that defines and exports the gameCycle function which takes in five parameters: **io** (the socket server instance), **currentGame** (the current game instance), **stackChoice** (the stack from which the current player chose to remove items), **numberToTake** (the amount the player chose to remove), and **socketID** (can represent either player). When items in all stacks equal zero, emits events to the winner and loser.

* `lib/move_wrapper.js` -- Module that contains a curried 'on move' function. It includes logic for the moveWrapper function that takes in three parameters: **socket** (can represent either player), **games** (an object containing instances), and **payload** (an array of data containing the game id and user's selections for their turn).

### Setup
#### `.env` Requirements
* PORT -- port to use (when running locally)

### Running the App
* Clone or download repo
* Run `npm i`
* Run `node server.js`

### Operating Instructions
* Part of a three part system. Please see these repos: 
* [API Server Repo](https://github.com/401-advanced-javascript-nimble/API_server)
* [Client Repo](https://github.com/401-advanced-javascript-nimble/client)

#### Tests
* **How do you run tests?** We refactored much of the code, wrapping functions in other functions in order to more easily test our own code.
* **What assertions were made?** Only two players per game.

#### UML
![UML](./assets/Nimble_UML.jpg)