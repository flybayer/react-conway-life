export default function cell() {
  let _alive = false;
  let _neighbors = {
    north: null,
    northEast: null,
    east: null,
    southEast: null,
    south: null,
    southWest: null,
    west: null,
    northWest: null
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

  function numberOfLivingNeighbors() {
    let livingNeighbors = 0;
    for (let neighbor in _neighbors) {
      if (!_neighbors[neighbor]) continue;
      if (_neighbors[neighbor].isAlive()) livingNeighbors++;
    }
    return livingNeighbors;
  }
  function willLive() {
    return passesAnyRule(_alive, numberOfLivingNeighbors())
  }
  function valid(neighbors) {
    for (let key in neighbors) {
      if (!(key in _neighbors)) return false;
    }
    return true;
  }
  function setNeighbors(neighbors) {
    if (!valid(neighbors)) throw new Error("invalid neighbors!");
    _neighbors = Object.assign(_neighbors, neighbors);
    return this;
  }

  const publicApi = {
    isAlive() { return _alive; },
    beAlive() {
      _alive = true;
      return this;
    },
    numberOfLivingNeighbors: numberOfLivingNeighbors,
    willLive: willLive,
    setNeighbors: setNeighbors,
    getNeighbors() { return Object.assign({}, _neighbors); },
    judgement() {
      _alive = willLive();
      return this;
    }
  };

  return publicApi;
}
