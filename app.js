'use strict';

const client = require('socket.io-client');
const prompt = require('prompt');

const socket = client.connect('http://localhost:3000');

socket.emit('move');

socket.on('moved', (payload) => {
  console.log('It\'s your turn');

  prompt.start();

  prompt.get(['move'], (err, data) => {
    socket.emit('move', {move: data.move});
    console.log('You selected', data.move);
  });
})