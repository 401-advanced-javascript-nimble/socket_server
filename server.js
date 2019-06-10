'use strict';

require('dotenv').config();
const prompt = require('prompt');

const events = require('./events.js');

const io = require('socket.io')(process.env.PORT);

// Chris - Global variable to control if the game is still ongoing or if it has ended.
let isGameOver = false;

// Chris - Here's a basic setup for stacks to use during the game.  Might not be best as an array, but it was the easiest for me to get started with.
// Refactoring into a different data type shouldn't be too tough if needed.
//Morgana - switched it over to dynamic ammounts
const stacks = {};

stacks.a = generateRandomAmount();
stacks.b = generateRandomAmount();
stacks.c = generateRandomAmount();

const players = [];

io.on('connect', (socket) => {
  console.log(`Socket ${socket.id} connected`);
  players.push(socket.id);

  if(players.length === 2) {
    io.to(`${players[0]}`).emit(events.turn, 'You Start');
  }

  socket.on(events.move, payload => {
    console.log(payload);

    let playerWhoMoved = players.indexOf(socket.id);
    if(playerWhoMoved === 0) {
      gameCycle(payload[0], payload[1]);
      io.to(`${players[1]}`).emit(events.turn, stacks);
    }
    if(playerWhoMoved === 1) {
      io.to(`${players[0]}`).emit(events.turn, stacks);
      gameCycle(payload[0], payload[1]);
    }
  });
});


// Chris - Here is the gameplay loop. This continues until totalRemainingItems is 0, which changes isGameOver to true.
const gameCycle = (stackChoice, numberToTake) => {
  if(checkChoices(stackChoice, numberToTake) === true) {
    takeItemsFromStack(stackChoice, numberToTake);
  }
  checkForGameOver();
  if(isGameOver === false) {
    console.log({totalItemsRemaining});
    // getInput();
  }
  else {
    console.log('GAME OVER!!!!!!!');
  }
};



//=============================================

//Morgana - generates a random amount between 5 and 25
function generateRandomAmount() {
  return Math.floor(Math.random() * 20) + 5;
}

// Chris - a tally to keep track of how many items are left game-wide accross all stacks. 
// When this is zero, game is over.
let totalItemsRemaining;

// Chris - this function tallies a new total for totalItemsRemaining after a player makes a valid move.
// would change if we go to something other than an array to store the stacks.
const _tallyTotalItemsRemaining = () => {
  let total = 0;
  for(let i in stacks) {
    total += stacks[i];
  }
  return total;
};

// Chris - sets initial state for totalItemsRemaining.  
// Typically this only runs inside the takeItemsFromStack function to ensure it is consistently updated during gameplay.
_tallyTotalItemsRemaining();

// Chris - This applies the player's move to the stack they selected, and updates totalRemainingItems.
// I'm subtracting 1 from the stackChoice to keep indexing simpler from a player's perpective (I doubt they'd choose to take from stack 0)
// would change if we go to something other than an array to store the stacks.
const takeItemsFromStack = (stackChoice, numberToTake) => {
  stacks[stackChoice] = stacks[stackChoice] - numberToTake;
  _tallyTotalItemsRemaining();
};

// Chris - checks and validates the players' inputs.
const checkChoices = (stackChoice, numberToTake) => {
  // checks and validation for stackChoice
  stackChoice.toLowerCase();
  if(!Object.keys(stacks).includes(stackChoice)) {
    console.log('Invalid stack choice');
    return false;
  }
  
  // checks and validation for numberToTake
  if(typeof numberToTake !== 'number') {
    numberToTake = parseInt(numberToTake);
  }
  if(isNaN(numberToTake) || numberToTake < 1 || numberToTake > stacks[stackChoice]) {
    console.log('Invalid numberToTake choice');
    return false;
  }

  // Chris - if all the above is good, return true to continue gameplay loop
  return true;
};

// Chris - used to end the game when totalRemainingItems is empty
const checkForGameOver = () => {
  if(totalItemsRemaining === 0) {
    isGameOver = true;
  }
  else {
    return;
  }
};


