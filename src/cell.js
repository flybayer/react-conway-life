export const MAX_IMMEDIATE_NEIGHBORS = 8;

export function cell() {
  let _alive = false;
  let _neighbors = new Map([
    ["north", null],
    ["northEast", null],
    ["east", null],
    ["southEast", null],
    ["south", null],
    ["southWest", null],
    ["west", null],
    ["northWest", null]
  ]);

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

  function numberOfNeighbors() {
    let result = 0;
    for (let neighbor of _neighbors.values()) {
      if (!neighbor) continue;
      result++;
    }
    return result;
  }
  function numberOfLivingNeighbors() {
    let livingNeighbors = 0;
    for (let neighbor of _neighbors.values()) {
      if (!neighbor) continue;
      if (neighbor.isAlive()) livingNeighbors++;
    }
    return livingNeighbors;
  }
  function willLive() {
    return passesAnyRule(_alive, numberOfLivingNeighbors())
  }
  function valid(neighbors) {
    for (let key in neighbors) {
      if (!_neighbors.has(key)) return false;
    }
    return true;
  }
  function create(options) {
    let cellsToCreate = 0;
    let numCreated = 0;

    if (!options.direction) options.direction = "east";

    if (options.immediate) {
      cellsToCreate = options.immediate;
      //
      // //TODO - create immediate neighbors in proper direction
      if (cellsToCreate > 0 && !_neighbors.get(options.direction)) {
        _neighbors.set(options.direction, cell());
        cellsToCreate--;
        numCreated++;
      }
      // linkNeighbors();
    }
    if (options.extended) {
      // cellsToCreate = options.extended;
      //
      // //TODO - create extended neighbors by in proper direction
      // cellsToCreate -= _neighbors[options.direction].create({
      //   immediate: ,
      //   direction: options.direction
      // });
      // linkNeighbors();
    }

    return numCreated;
  }
  function setNeighbors(newNeighbors) {
    if (!valid(newNeighbors)) throw new Error("invalid neighbors!");
    for (let neighbor in newNeighbors) {
      _neighbors.set(neighbor, newNeighbors[neighbor]);
    }
    return this;
  }

  const publicApi = {
    isAlive() { return _alive; },
    beAlive() {
      _alive = true;
      return this;
    },
    numberOfNeighbors: numberOfNeighbors,
    numberOfLivingNeighbors: numberOfLivingNeighbors,
    willLive: willLive,
    create: create,
    setNeighbors: setNeighbors,
    getNeighbors() {
      const result = {};
      for (let [neighborKey, neighborValue] of _neighbors) {
        result[neighborKey] = neighborValue;
      }
      return result;
    },
    judgement() {
      _alive = willLive();
      return this;
    }
  };

  return publicApi;
}
