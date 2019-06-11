'use strict';

require('dotenv').config();

const events = require('./events.js');

const io = require('socket.io')(process.env.PORT);

//===========================================
//Global Variables
//===========================================

// Chris - a tally to keep track of how many items are left game-wide accross all stacks. 
// When this is zero, game is over.
let totalItemsRemaining;

// Chris - Here's a basic setup for stacks to use during the game.
//Morgana - switched it over to being an object and using dynamic amounts.
let stacks = {
  a: generateRandomAmount(),
  b: generateRandomAmount(),
  c: generateRandomAmount(),
};

let players = [];

//===========================================
//Sockets
//===========================================

io.on('connect', (socket) => {
  console.log(`Socket ${socket.id} connected`);
  players.push(socket.id);

  if(players.length === 1) {
    io.to(`${players[0]}`).emit(events.message, 'Waiting for second player...');
  }

  if(players.length === 2) {
    io.to(`${players[0]}`).emit(events.turn, stacks);
  }

  socket.on(events.move, payload => {
    let playerWhoMoved = players.indexOf(socket.id);
    
    if(playerWhoMoved === 0) {
      gameCycle(payload[0], payload[1]);
      io.to(`${players[1]}`).emit(events.turn, stacks);
    }
    else if(playerWhoMoved === 1) {
      gameCycle(payload[0], payload[1]);
      io.to(`${players[0]}`).emit(events.turn, stacks);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    players.splice(players.indexOf[socket.id], 1);
  });
});


//===========================================
//Server Side Game Logic
//===========================================

//Morgana - refactored to handle new stack structure and gameover emits
const gameCycle = (stackChoice, numberToTake) => {
  // if(checkChoices(stackChoice, numberToTake) === true) {
  takeItemsFromStack(stackChoice, numberToTake);
  // }
  if(totalItemsRemaining !== 0) {
    console.log({totalItemsRemaining});
  }
  else {
    console.log('GAME OVER!!!!!!!');
    io.to(`${players[0]}`).emit(events.gameOver, 'Game Over!');
    io.to(`${players[1]}`).emit(events.gameOver, 'Game Over!');
    players = [];
    stacks = {
      a: generateRandomAmount(),
      b: generateRandomAmount(),
      c: generateRandomAmount(),
    };
  }
};

//Morgana - generates a random amount between 5 and 25
function generateRandomAmount() {
  return Math.floor(Math.random() * 20) + 5;
}

// Chris - this function tallies a new total for totalItemsRemaining after a player makes a valid move.
// Morgana - adjusted for new stack structure
const _tallyTotalItemsRemaining = () => {
  let total = 0;
  for(let i in stacks) {
    total += stacks[i];
  }
  totalItemsRemaining = total;
};

// Chris - This applies the player's move to the stack they selected, and updates totalRemainingItems.
// Morgana - adjusted for new stack structure
const takeItemsFromStack = (stackChoice, numberToTake) => {
  stacks[stackChoice] = stacks[stackChoice] - numberToTake;
  _tallyTotalItemsRemaining();
};


