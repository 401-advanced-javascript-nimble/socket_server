'use strict';

function emitWrapper(io, event, payload, target){
  if(!target) {
    return io.emit(event, payload);
  }
  else {
    return io.to(target).emit(event, payload);
  }
}

module.exports = emitWrapper;