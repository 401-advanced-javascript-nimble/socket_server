'use strict';

require('dotenv').config();

const io = require('socket.io')(process.env.PORT);

const connectionWrapper = require('./lib/connection_wrapper.js')(io);
const moveWrapper = require('./lib/move_wrapper.js')(io);
const disconnectWrapper = require('./lib/disconnect_wrapper.js')(io);

const events = require('./events.js');

// const emitWrapper = require('./lib/emit_wrapper.js');

let gamesHolder = {};

io.on('connect', connectionContainer);


function connectionContainer(socket) {
  console.log(`Socket ${socket.id} connected`);

  const {games, players} = connectionWrapper(socket);
  gamesHolder = games;

  socket.on(events.move, payload => {
//     const gameID = payload[0];
//     const stackChoice = payload[1];
//     const numberToTake = payload[2];
//     const currentGame = games[gameID];
//     clearInterval(currentGame.countdown);
//     currentGame.timeLeft = 20;
//     let playerWhoMoved = currentGame.players.indexOf(socket.id);
    
//     if(playerWhoMoved === 0) {
//       const otherPlayer = currentGame.players[1];
//       gameCycle(currentGame, stackChoice, numberToTake, otherPlayer);
//       io.to(`${currentGame.players[1]}`).emit(events.turn, [currentGame.id, currentGame.stacks]);
//       currentGame.countdown = setInterval(currentGame.decrement, 1000, currentGame.players[1]);
//       io.to(`${currentGame.players[0]}`).emit(events.message, 'Waiting for other player to move');  
//     }
//     else if(playerWhoMoved === 1) {
//       const otherPlayer = currentGame.players[0];
//       gameCycle(currentGame, stackChoice, numberToTake, otherPlayer);
//       currentGame.countdown = setInterval(currentGame.decrement, 1000, currentGame.players[0]);
//       io.to(`${currentGame.players[0]}`).emit(events.turn, [currentGame.id, currentGame.stacks]);
//       io.to(`${currentGame.players[1]}`).emit(events.message, 'Waiting for other player to move');
//     }

    moveWrapper(socket, gamesHolder, payload);
  });

  socket.on('disconnect', () => {
    disconnectWrapper(socket, gamesHolder);
  });

}