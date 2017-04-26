'use strict';

function forEachMap(map, sideEffect) {
  Object.keys(map).forEach(name => {
    sideEffect(map[name], name);
  });
}

module.exports = forEachMap;
