# 401 Midterm - Nimble

## Socket Server

#### Authors: Becky, Chris, Joé, Morgana

## Links & Resources
* [GitHub Repo](https://github.com/401-advanced-javascript-nimble/client)
* [Heroku Deployment](https://nimble-api-server.herokuapp.com/)
* [Microsoft Azure Deploylment](https://401-advanced-javascript-nimble-socket-server.azurewebsites.net)
* [Travis]( --- )

### Documentation

### Modules
* `server.js` -- Requires **dotenv** and **socket.io** and creates a socket server instance. Defines a function called connectionContainer that includes logic to record game and players, reacts to player moves, and reacts when a user opts to disconnect.
* `game.js` -- Module that defines the Game class and related methods. Specifically, the starting amount in each stack, the **takeItemsRemaining** method to remove items from a stack, **tallyTotalItemsRemaining** to keep track of overall remaining items, and **decrement** to show the time remaining for each turn.
* `events.js` -- Module that exports an object with events the socket server will be listening for, namely, move, turn, gameOver, message, countdown, and win.
* `lib/connection_wrapper.js` -- Module that uses the curryIo function. It includes logic that keeps track of how many players are available for a game. If only one player has joined, they receive the message, 'Waiting for second player...'. If a second player joins, a new game is created. The message event 'Starting game' is sent to player one, followed by a turn event. The message event 'Starting game' is sent to player two, followed by the message event 'Waiting for player to move'.
* `lib/disconnect_wrapper.js` -- Module that uses the curryIo function. It includes logic that emits the message event, 'Player disconnected, ending game', when either player ends the game AND logic that emits the gameOver event with message, 'Game Over!', when either player ends a game.
* `lib/emit_wrapper.js` -- Module with logic for the emitWrapper function that takes in four parameters: **io** (the socket server instance), **event**, (the event to listen for), **payload** (usually data associated with an event), and **target** (the client id for a specific player). If a target exists, the emitted event is sent to that specific player. Otherwise the emitted event is sent to all listening parties.
* `lib/game_cycle.js` -- Module that defines and exports the gameCycle function which takes in five parameters: **io** (the socket server instance), **currentGame** (the current game instance), **stackChoice** (the stack from which the current player chose to remove items), **numberToTake** (the amount the player chose to remove), and **socketID** (can represent either player). Includes logic that states the winner based on the number of remaining items. Emits events to the winner and loser regarding their game status.
* 
* `lib/move_wrapper.js` -- Module that uses the curryIo function. It includes logic for the moveWrapper function that takes in three parameters: **socket** (can represent either player), **games** (an object with a property containing current game id), and **payload** (an array of data containing the user's selections for their turn).




* `src/commands/handle_leaderboard.js` -- Module with async function to render the leaderboard. Specifically, it requires **superagent** for AJAX requests to our server for user stats, **cli-table** to build the leaderboard table in the command line, and **figlet** to create ASCII Art from text.
* `src/commands/handle_play.js` -- Module with async function to validate user token and start new game.
* `src/commands/handle_signin.js` -- Module that requires **prompts** to create a more colorful CLI interface, **clear** to clear the terminal screen, and **figlet** to create ASCII Art from text. Specifically, it includes an async function that prompts user for username and password for **signin**.

* `src/commands/handle_signout.js` -- Module with logic to sign user out.

* `src/commands/handle_signup.js` -- Module that requires **prompts** to create a more colorful CLI interface, **clear** to clear the terminal screen, and **figlet** to create ASCII Art from text. Specifically, it includes an async function that prompts user for username and password for **signup**.

* `src/lib/User.js` -- Module that requires **superagent** for AJAX requests to our server, and **configstore** as a means to store user data. A User class is defined with methods to create, hold, and delete a user authentication token. This is used to communicate the user's win/loss status of the current game to the API Server.

* `src/lib/game.js` -- Module that requires **socket.io-client**, and **prompts**. A Game class is defined and includes logic for the **client socket** to react to events such as a message from the server, a new turn, turn countdown, clear line after timeout, game over, and game win. It also includes logic for **prompt functionality** such as 'Which stack?' and 'How much?', and **client-side game logic** to validate stack and amount provided by user.



### Setup
#### `.env` Requirements
* SECRET -- token generation
* MONGODB_URI -- database location
* TOKEN_EXPIRATION_TIME -- token lifetime
* PORT -- port to use (when running locally)
* API_SERVER_URI=https://nimble-api-server.herokuapp.com
* SOCKET_SERVER_URL=https://401-advanced-javascript-nimble-socket-server.azurewebsites.net

### Running the App
* `POST /signup` -- Add a user to the database.  If the user's role is a superuser, they will be provided a key, otherwise the user will receive a token.  Requires: username, password, email
Optional: role
* `POST /signin` -- Passes through auth middleware to verify username and password, and provides a new token if successful.
Requires: username, password
* `GET /leaderboard`
* `PUT /socket` -- Used for the socket server/client to send updates after a game to be saved to the database.
Requires: stats: {wins}
* `GET /admin`

### Operating Instructions
* The RESTful API server runs live at https://nimble-api-server.herokuapp.com/. Perform the above requests to interact with the API. 

#### Tests
* How do you run tests?
* What assertions were made?
* What assertions need to be / should be made?

#### UML
![UML](./assets/Nimble_UML.jpg)