'use strict';

class Game {
  constructor(id) {
    this.id = id;
    // Chris - Here's a basic setup for stacks to use during the game.
    //Morgana - switched it over to being an object and using dynamic amounts.
    this.stacks = {
      a: this.generateRandomAmount(),
      b: this.generateRandomAmount(),
      c: this.generateRandomAmount(),
    };
    // Chris - a tally to keep track of how many items are left game-wide accross all stacks. 
    // When this is zero, game is over.
    this.totalItemsRemaining;
  }

  //Morgana - generates a random amount between 5 and 25
  generateRandomAmount() {
    return Math.floor(Math.random() * 20) + 5;
  }

  // Chris - this function tallies a new total for totalItemsRemaining after a player makes a valid move.
  // Morgana - adjusted for new stack structure
  _tallyTotalItemsRemaining() {
    let total = 0;
    for(let i in this.stacks) {
      total += this.stacks[i];
    }
    this.totalItemsRemaining = total;
  }

  // Chris - This applies the player's move to the stack they selected, and updates totalRemainingItems.
  // Morgana - adjusted for new stack structure
  takeItemsFromStack (stackChoice, numberToTake) {
    this.stacks[stackChoice] = this.stacks[stackChoice] - numberToTake;
    this._tallyTotalItemsRemaining();
  }

}

module.exports = Game;