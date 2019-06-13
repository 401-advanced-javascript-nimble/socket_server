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
    moveWrapper(socket, games, payload);
  });

  socket.on('disconnect', () => {
    disconnectWrapper(socket, games);
  });

}