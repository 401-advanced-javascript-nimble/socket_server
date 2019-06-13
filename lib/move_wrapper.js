'use strict';

const emitWrapper = require('./emit_wrapper.js');
const events = require('../events.js');
const gameCycle = require('./game_cycle.js');

function curryIo(io) {
  return function moveWrapper(socket, games, payload) {

    const gameID = payload[0];
    const stackChoice = payload[1];
    const numberToTake = payload[2];
    const currentGame = games[gameID];
    clearInterval(currentGame.countdown);
    currentGame.timeLeft = 20;
    let playerWhoMoved = currentGame.players.indexOf(socket.id);
    
    if(playerWhoMoved === 0) {
      const otherPlayer = currentGame.players[1];
      gameCycle(io, currentGame, stackChoice, numberToTake, otherPlayer);
      emitWrapper(io, events.turn, [currentGame.id, currentGame.stacks], `${currentGame.players[1]}`);
      currentGame.countdown = setInterval(currentGame.decrement, 1000, currentGame.players[1]);
      emitWrapper(io, events.message, 'Waiting for other player to move', `${currentGame.players[0]}`);
    }
    else if(playerWhoMoved === 1) {
      const otherPlayer = currentGame.players[0];
      gameCycle(io, currentGame, stackChoice, numberToTake, otherPlayer);
      emitWrapper(io, events.turn, [currentGame.id, currentGame.stacks], `${currentGame.players[0]}`);
      currentGame.countdown = setInterval(currentGame.decrement, 1000, currentGame.players[0]);
      emitWrapper(io, events.message, 'Waiting for other player to move', `${currentGame.players[1]}`);
    }
  };
}

module.exports = curryIo;