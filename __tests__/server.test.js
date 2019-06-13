'use strict';

const emitWrapper = require('../lib/emit_wrapper.js');
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

const mockSocket1 = {
  id: 'Alice',
  gameID: 0,
};

const mockSocket2 = {
  id: 'Ted',
  gameID: 0,
};

const testIo = new MockIo;

let gameHolder = {};

describe( 'Event Emitter', () => {
  const eventTestIo = new MockIo;
  it( 'Wraps the emit event', () => {
    emitWrapper(eventTestIo, 'move', [1,3], 'fred');
  });
  it('Does not require a target', () => {
    emitWrapper(eventTestIo, 'move', [4,5]);
  });
});

describe('Game creation', () => {
  const connectionWrapper = require('../lib/connection_wrapper.js')(testIo);

  it('When a single socket connects, it stores the socket and sends a wait message', () => {
    const {games, players} = connectionWrapper(mockSocket1);
    expect(players.length).toBe(1);
    expect(players[0].id).toBe('Alice');
    expect(typeof testIo.payload).toBe('string');
  });

  it('When a second socket connects, it creates a game, sets the countdown, and clears the players array (waitingroom)', () => {
    const {games, players} = connectionWrapper(mockSocket2);
    gameHolder = games;

    expect(Object.keys(games).length).toBe(1);
    expect(games[0]).toBeDefined();
    expect(games[0]).toBeInstanceOf(Game);
    expect(games[0].countdown).toBeDefined();
    expect(players).toStrictEqual([]);
  });
});

describe('On move', () => {
  const moveWrapper = require('../lib/move_wrapper.js')(testIo);
  it('Can correctly target the player/socket that \'moved\'', () => {

    moveWrapper(mockSocket1, gameHolder, [mockSocket1.gameID,'a',3]);
    expect(testIo.target).toBe('Alice');
    expect(typeof testIo.payload).toBe('string');

    moveWrapper(mockSocket2, gameHolder, [mockSocket1.gameID,'b',3]);
    expect(testIo.target).toBe('Ted');
    expect(typeof testIo.payload).toBe('string');
  });
});

describe('Game Cycle', () => {
  const gameCycle = require('../lib/game_cycle.js');
  it('if the stacks are empty, the game ends', () => {
    gameHolder[0].stacks['a'] = 1;
    gameHolder[0].stacks['b'] = 0;
    gameHolder[0].stacks['c'] = 0;
    gameCycle(testIo, gameHolder[0], 'a', 1, mockSocket1.id);
    expect(testIo.payload).toBe('Game Over!');
  });
  it('targets the correct player for win/loss', () => {
    gameHolder[0].stacks['a'] = 1;
    gameHolder[0].stacks['b'] = 0;
    gameHolder[0].stacks['c'] = 0;
    let results = gameCycle(testIo, gameHolder[0], 'a', 1, mockSocket1.id);
    expect(results.winner).toBe('Alice');
    expect(results.loser).toBe('Ted');

    gameHolder[0].stacks['a'] = 1;
    gameHolder[0].stacks['b'] = 0;
    gameHolder[0].stacks['c'] = 0;
    results = gameCycle(testIo, gameHolder[0], 'a', 1, mockSocket2.id);
    expect(results.winner).toBe('Ted');
    expect(results.loser).toBe('Alice');
  });
});

describe('On Disconnect', () => {
  it('if a player disconnects mid-game, it ends the game', () => {
    const disconnectWrapper = require('../lib/disconnect_wrapper.js')(testIo);
    const ended = disconnectWrapper(mockSocket1, gameHolder);
    expect(testIo.payload).toBe('Game Over!');
    expect(ended).toStrictEqual(gameHolder[0]);
  });
});