'use strict';

const emitWrapper = require('./emit_wrapper.js');
const events = require('../events.js');

function gameCycle(io, currentGame, stackChoice, numberToTake, socketID) {
  currentGame.takeItemsFromStack(stackChoice, numberToTake);

  if (currentGame.totalItemsRemaining !== 0) {
    console.log('Total remaining', currentGame.totalItemsRemaining);
  } else {
    const winner = socketID;
    let loser;
    if (currentGame.players[0] === socketID) loser = currentGame.players[1];
    if (currentGame.players[1] === socketID) loser = currentGame.players[0];

    console.log('GAME OVER!!!!!!!');
    emitWrapper(io, events.win, '', `${winner}`);
    emitWrapper(io, events.message, '😔  You\'ve lost', `${loser}`);
    emitWrapper(io, events.gameOver, 'Game Over!', `${currentGame.players[0]}`);
    emitWrapper(io, events.gameOver, 'Game Over!', `${currentGame.players[1]}`);

    clearInterval(currentGame.countdown);
    currentGame.timeLeft = 20;
    return { winner, loser };
  }
}

module.exports = gameCycle;
