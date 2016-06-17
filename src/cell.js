export default function cell() {
  let _alive = false;
  const _neighbors = {
    top: null,
    topRight: null,
    right: null,
    bottomRight: null,
    bottom: null,
    bottomLeft: null,
    left: null,
    topLeft: null
  };

  const passesRule2 = (isAlive, livingNeighbors) => (
    //Rules 1 & 3 are just clarifications of rule 3
    //Only passes if alive and has 2 or 3 living neighbors
    isAlive && (livingNeighbors === 2 || livingNeighbors === 3)
  );
  const passesRule4 = (isAlive, livingNeighbors) => (
    //Only passes if dead and has 3 living neighbors
    !isAlive && livingNeighbors === 3
  );
  const passesAnyRule = (...args) => (passesRule2(...args) || passesRule4(...args));

  function willLive() {
    let livingNeighbors = 0;
    for (let neighbor in _neighbors) {
      if (!_neighbors[neighbor]) continue;
      if (_neighbors[neighbor].isAlive()) livingNeighbors++;
    }
    return passesAnyRule(_alive, livingNeighbors)
  }

  const publicApi = {
    isAlive() { return _alive; },
    willLive: willLive
  };

  return publicApi;
}
