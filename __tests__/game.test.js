'use strict';

const Game = require('../game.js');

class MockIo {
  constructor() {
    
  }
  to(target) {
    this.target = target;
    return this;
  }
  emit(event, payload) {
    this.event = event;
    this.payload = payload;
    return this;
  }
}

const testIo = new MockIo;

describe( 'Game Class', () => {

  describe('instantiating', () => {
    it('can instantiate with an id and io', () => {
      const gameWithId = new Game(7, testIo);
      expect(gameWithId.id).toBe(7);
      expect(gameWithId.io).toBeDefined;
    });

    it('instantiating without id and io results in undefineds', () => {
      const emptyGame = new Game();
      expect(emptyGame.id).not.toBeDefined();
      expect(emptyGame.io).not.toBeDefined();
    });
  });

  describe('starting properties', () => {
    const testGame = new Game(42);

    it('should have stacks', () => {
      expect(testGame.stacks).toBeDefined();
      expect(testGame.stacks.a).toBeDefined();
      expect(Object.keys(testGame.stacks)).toEqual(expect.arrayContaining(['a', 'b', 'c']));
      expect(typeof testGame.stacks.a).toBe('number');
    });

    it('can add players', () => {
      expect(testGame.players).toBeDefined();

      testGame.players.push('fred');
      testGame.players.push('george');

      expect(testGame.players[0]).toBe('fred');
      expect(testGame.players[1]).toBe('george');
    });

    it('has a turn time limit', () => {
      expect(testGame.timeLeft).toBeDefined();
      expect(typeof testGame.timeLeft).toBe('number');
      expect(testGame.timeLeft > 0).toBeTruthy();
      expect(testGame.countdown).toBeDefined();
    });

    it('has a property to store the total number of things in the stacks', () => {
      expect(testGame.totalItemsRemaining).toBeDefined();
      expect(typeof testGame.totalItemsRemaining).toBe('number');    
    });
  });

  describe('Methods', () => {
    const testGame = new Game(12, testIo);

    it('can randomly generate amounts for the stacks', () => {
      expect(typeof testGame.generateRandomAmount()).toBe('number');
      expect(testGame.generateRandomAmount() >= 0).toBeTruthy();
    });

    it('can tally the total items in the stacks', () => {
      const a = testGame.stacks.a;
      const b = testGame.stacks.b;
      const c = testGame.stacks.c;
      const total = a + b + c;

      testGame._tallyTotalItemsRemaining();
      expect(testGame.totalItemsRemaining).toEqual(total);
    });

    it('can remove a given amount from a given stack', () => {
      const startingValue = testGame.stacks.a;
      testGame.takeItemsFromStack('a', 4);
      expect(testGame.stacks.a).toEqual(startingValue - 4);
    });

    it('can decrement the time left', () => {
      const startingTime = testGame.timeLeft;
      testGame.players.push('mock player');
      testGame.decrement('mock player');
      expect(testGame.timeLeft).toEqual(startingTime - 1);
    });

    it('if time runs out, it ends the game', () => {
      testGame.timeLeft = 0;
      testGame.decrement('mock player');
      expect(testGame.io.payload).toBe('Game Over!');
    });
  });
});