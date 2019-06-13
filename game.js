'use strict';

/**
 * Game Class Module
 * @module game
 * @exports Game - Game class
 */

const events = require('./events.js');
const emitWrapper = require('./lib/emit_wrapper.js');

/**
 * Game Class
 * @class Game
 */
class Game {
  /**
   * Constructor
   * @constructor
   * @param {*} id - Game id
   * @param {*} io - Socket server instance
   */
  constructor(id, io) {
    this.io = io || null;
    this.id = id || null;
    // Chris - Here's a basic setup for stacks to use during the game.
    //Morgana - switched it over to being an object and using dynamic amounts.
    this.stacks = {
      a: this.generateRandomAmount(),
      b: this.generateRandomAmount(),
      c: this.generateRandomAmount(),
    };
    this.players = [];
    this.timeLeft = 20;
    this.countdown = null;
    // Chris - a tally to keep track of how many items are left game-wide accross all stacks. 
    // When this is zero, game is over.
    this.totalItemsRemaining = 0;
    this.decrement = this.decrement.bind(this);
  }
  
  /**
   * Decrement 
   * @method decrement
   * @param {*} player - Player socket id
   * Decrements the timeLeft variable and emits an event to the player
   * Emits game over events if the time funs out
   * Triggered at some interval in the socket server
   */
  decrement(player) {
    this.timeLeft = this.timeLeft - 1;
    console.log(this.timeLeft);

    emitWrapper(events.countdown, this.timeLeft, this.io.to(`${player}`).emit);
    // this.io.to(`${player}`).emit(events.countdown, this.timeLeft);
    if (this.timeLeft === -1) {
      console.log('Ran out of time!!');

      emitWrapper(events.message, 'Time\'s up!!', this.io.emit);
      // this.io.emit(events.message, 'Time\'s up!!');
      
      emitWrapper(events.gameOver, 'Game Over!', this.io.to(`${this.players[0]}`).emit);
      // this.io.to(`${this.players[0]}`).emit(events.gameOver, 'Game Over!');

      emitWrapper(events.gameOver, 'Game Over!', this.io.to(`${this.players[1]}`).emit);
      // this.io.to(`${this.players[1]}`).emit(events.gameOver, 'Game Over!');
      clearInterval(this.countdown);
      this.countdown = null;
      this.timeLeft = 20;
    }
  }

  /**
   * Generate Random Ammount
   * @method generateRandomAmount
   * Generates a random number between 5 and 25
   */
  generateRandomAmount() {
    return Math.floor(Math.random() * 20) + 5;
  }

  /**
   * Tally Remaining
   * @method _tallyTotalItemsRemaining
   * Tallies the total amount in all stacks
   * Updates the totalItemsRemaining property
   */
  _tallyTotalItemsRemaining() {
    let total = 0;
    for(let i in this.stacks) {
      total += this.stacks[i];
    }
    this.totalItemsRemaining = total;
  }

  // Chris - This applies the player's move to the stack they selected, and updates totalRemainingItems.
  /**
   * Take from Stack
   * @method takeItemsFromStack
   * @param {String} stackChoice - Stack to remove items from 
   * @param {Number} numberToTake - Amount to remove
   * Given a stack name and an amount, removes the amount from the stack and runs the _tallyTotalRemaining method
   */
  takeItemsFromStack (stackChoice, numberToTake) {
    this.stacks[stackChoice] = this.stacks[stackChoice] - numberToTake;
    this._tallyTotalItemsRemaining();
  }

}

module.exports = Game;