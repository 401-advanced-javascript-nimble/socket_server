'use strict';

const client = require('socket.io-client');
const prompt = require('prompt');

const socket = client.connect('http://localhost:3000');

// socket.emit('move');

socket.on('turn', (payload) => {
  console.log('It\'s your turn');
  console.log(payload);

  prompt.start();

  prompt.get(['stack', 'amount'], (err, data) => {
    if(err) {
      throw new Error(err);
    }
    let stack = data.stack;
    let amount = data.amount;

    socket.emit('move', [stack, amount]);
    // gameCycle(stackNumber, numberToTake);
  });
});

socket.on('game over', (payload) => {
  console.log('Game Over!');
  socket.close();
});