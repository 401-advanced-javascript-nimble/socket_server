'use strict';

function emitWrapper(event, payload, callback) {
  return callback(event, payload);
}

module.exports = emitWrapper;