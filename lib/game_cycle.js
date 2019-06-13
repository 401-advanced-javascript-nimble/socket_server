'use strict';

const emitWrapper = require('./emit_wrapper.js');
const events = require('../events.js');

function gameCycle (io, currentGame, stackChoice, numberToTake, socketID) {

  currentGame.takeItemsFromStack(stackChoice, numberToTake);

  if(currentGame.totalItemsRemaining !== 0) {
    console.log('Total remaining', currentGame.totalItemsRemaining);
  }
  else {
    console.log('GAME OVER!!!!!!!');
    emitWrapper(io, events.win, '', `${socketID}`);
    emitWrapper(io, events.gameOver, 'Game Over!', `${currentGame.players[0]}`);
    emitWrapper(io, events.gameOver, 'Game Over!', `${currentGame.players[1]}`);

    clearInterval(currentGame.countdown);
    currentGame.timeLeft = 20;
  }
}

module.exports = gameCycle;