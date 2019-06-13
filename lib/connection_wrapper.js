'use strict';

const events = require('../events.js');
const Game = require('../game.js');
const emitWrapper = require('./emit_wrapper.js');

let players = [];
const games = {};

function curryIo(io) {
  return function connectionWrapper(socket) {

    socket.gameID = 'none yet';
  
    players.push(socket);

    if(players.length === 1) {
      emitWrapper(io, events.message, 'Waiting for second player...', `${players[0].id}`);
    }

    if(players.length === 2) {
      const gameID = Object.keys(games, io).length;
      players[0].gameID = gameID;
      players[1].gameID = gameID;

      let gameInstance = new Game(gameID, io);
      gameInstance.players = [players[0].id, players[1].id];
    
      emitWrapper(io, events.message, 'Starting Game', `${gameInstance.players[0]}`);
      emitWrapper(io, events.turn, [gameInstance.id, gameInstance.stacks], `${gameInstance.players[0]}`);

      emitWrapper(io, events.message, 'Starting Game', `${gameInstance.players[1]}`);
      emitWrapper(io, events.message, 'Waiting for other player to move', `${gameInstance.players[1]}`);

      gameInstance.countdown = setInterval(gameInstance.decrement, 1000, gameInstance.players[0]);

      games[gameID] = gameInstance;
      players = [];
    } 

    return {games, players};
  };
}

module.exports = curryIo;