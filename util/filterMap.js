'use strict';

function filterMap(map, predicate) {
  return Object.keys(map).reduce((initial, name) => {
    const value = map[name];

    if (predicate.call(map, value, name)) {
      initial[name] = value;
    }

    return initial;
  }, {});
}

module.exports = filterMap;
