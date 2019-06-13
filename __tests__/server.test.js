'use strict';

const emitWrapper = require('../lib/emit_wrapper.js');

describe( 'Emit Wrapper', () => {
  it( 'When passed an event, a payload, and a callback, it runs the callback with the event and payload', () => {
    const event = 12;
    const payload = 3;
    function callback (event, payload) {
      return event + payload;
    }
    expect(emitWrapper(event, payload, callback)).toEqual(15);
  });
});