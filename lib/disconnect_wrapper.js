'use strict';

const emitWrapper = require('./emit_wrapper.js');
const events = require('../events.js');

function curryIo(io) {
  return function disconnectWrapper(socket, games) {
    console.log(`Socket ${socket.id} disconnected`);

    console.log('on disconnect', socket.gameID);
    const gameToEnd = games[socket.gameID];

    if(gameToEnd) {
      emitWrapper(io, events.message, 'Player disconnected, ending game', `${gameToEnd.players[0]}`);
      emitWrapper(io, events.gameOver, 'Game Over!', `${gameToEnd.players[0]}`);
      emitWrapper(io, events.message, 'Player disconnected, ending game', `${gameToEnd.players[1]}`);
      emitWrapper(io, events.gameOver, 'Game Over!', `${gameToEnd.players[1]}`);
      clearInterval(gameToEnd.countdown);
      gameToEnd.timeLeft = 20;
    }
  };
}

module.exports = curryIo;