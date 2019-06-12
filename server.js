'use strict';

require('dotenv').config();

const events = require('./events.js');
const Game = require('./game.js');

const io = require('socket.io')(process.env.PORT);

//===========================================
//Global Variables
//===========================================

let games = {};

let players = [];

//===========================================
//Sockets
//===========================================

io.on('connect', (socket) => {
  console.log(`Socket ${socket.id} connected`);
  socket.gameID = 'none yet';
  
  players.push(socket);

  if(players.length === 1) {
    io.to(`${players[0].id}`).emit(events.message, 'Waiting for second player...');
  }

  if(players.length === 2) {
    //Morgana - When there are two players, create a new game instance with an id
    let gameInstance = new Game(Object.keys(games).length);
    //Morgana - Set the players, and save the game to the games object
    //Morgana - spread operator creates a shallow copy, avoiding reference issues
    gameInstance.players = [players[0].id, players[1].id];
    games[gameInstance.id] = gameInstance;
    players[0].gameID = gameInstance.id;
    players[1].gameID = gameInstance.id;

    //Morgana - send the initial game-start messages
    io.to(`${gameInstance.players[0]}`).emit(events.message, 'Starting Game');
    io.to(`${gameInstance.players[1]}`).emit(events.message, 'Starting Game');
    io.to(`${gameInstance.players[1]}`).emit(events.message, 'Waiting for other player to move');
    io.to(`${gameInstance.players[0]}`).emit(events.turn, [gameInstance.id, gameInstance.stacks]);

    //Morgana - empty the players array once a game is initialized
    players = [];
  }

  socket.on(events.move, payload => {

    const gameID = payload[0];
    const stackChoice = payload[1];
    const numberToTake = payload[2];
    const currentGame = games[gameID];
    let playerWhoMoved = currentGame.players.indexOf(socket.id);
    
    if(playerWhoMoved === 0) {
      gameCycle(currentGame, stackChoice, numberToTake, socket.id);
      io.to(`${currentGame.players[1]}`).emit(events.turn, [currentGame.id, currentGame.stacks]);
      io.to(`${currentGame.players[0]}`).emit(events.message, 'Waiting for other player to move');
      
    }
    else if(playerWhoMoved === 1) {
      gameCycle(currentGame, stackChoice, numberToTake, socket.id);
      io.to(`${currentGame.players[0]}`).emit(events.turn, [currentGame.id, currentGame.stacks]);
      io.to(`${currentGame.players[1]}`).emit(events.message, 'Waiting for other player to move');
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);

    console.log('on disconnect', socket.gameID);
    const gameToEnd = games[socket.gameID];

    if(gameToEnd) {
      io.to(`${gameToEnd.players[0]}`).emit(events.message, 'Player disconnected, ending game');
      io.to(`${gameToEnd.players[0]}`).emit(events.gameOver, 'Game Over!');
      io.to(`${gameToEnd.players[1]}`).emit(events.message, 'Player disconnected, ending game');
      io.to(`${gameToEnd.players[1]}`).emit(events.gameOver, 'Game Over!');
    }

    if(players.includes(socket)) players.splice(players.indexOf(socket.id), 1);
  });
});


//===========================================
//Server Side Game Logic
//===========================================

//Morgana - refactored to handle new stack structure and gameover emits
const gameCycle = (currentGame, stackChoice, numberToTake, socketID) => {

  currentGame.takeItemsFromStack(stackChoice, numberToTake);

  if(currentGame.totalItemsRemaining !== 0) {
    console.log('Total remaining', currentGame.totalItemsRemaining);
  }
  else {
    console.log('GAME OVER!!!!!!!');
    //Morgana - pass win back to client
    io.to(`${socketID}`).emit(events.win);
    io.to(`${currentGame.players[0]}`).emit(events.gameOver, 'Game Over!');
    io.to(`${currentGame.players[1]}`).emit(events.gameOver, 'Game Over!');
  }
};



