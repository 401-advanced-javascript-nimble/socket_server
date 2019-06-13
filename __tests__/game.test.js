'use strict';

const Game = require('../game.js');

describe( 'Game Class', () => {

  describe('instantiating', () => {
    it('can instantiate with an id', () => {
      const gameWithId = new Game(7);
      expect(gameWithId.id).toBe(7);
    });
    
    it('if no id passed in, id equals null', () => {
      const emptyGame = new Game();
      expect(emptyGame.id).toBeNull();
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

    it('has a property to store reference to the server socket', () => {
      expect(testGame.io).toBeDefined();
    });
  });

  describe('Methods', () => {
    const testGame = new Game(12);

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

    // it('can decrement the time left', () => {
    //   const startingTime = testGame.timeLeft;
    //   testGame.players.push('mock player');
    //   testGame.decrement('mock player');
    //   expect(testGame.timeLeft).toEqual(startingTime - 1);
    // });
  });
});