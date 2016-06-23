export const MAX_IMMEDIATE_NEIGHBORS = 8;

const CARDINALS = {
  east:  ["east", "south", "west", "north"],
  south: ["south", "west", "north", "east"],
  west:  ["west", "north", "east", "south"],
  north: ["north", "east", "south", "west"]
};
const INTERCARDINALS = {
  east:  ["southEast", "southWest", "northWest", "northEast"],
  south: ["southWest", "northWest", "northEast", "southEast"],
  west:  ["northWest", "northEast", "southEast", "southWest"],
  north: ["northEast", "southEast", "southWest", "northWest"]
}

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

export function cell() {
  let _alive = false;
  const _neighbors = new Map([
    ["north", null],
    ["northEast", null],
    ["east", null],
    ["southEast", null],
    ["south", null],
    ["southWest", null],
    ["west", null],
    ["northWest", null]
  ]);

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

    if (!options.startingDirection) options.startingDirection = "east";

    if (options.immediate) {
      cellsToCreate = options.immediate;
      if (cellsToCreate == 0) return numCreated;

      for (let direction of CARDINALS[options.startingDirection]) {
        _neighbors.set(direction, cell());
        cellsToCreate--;
        numCreated++;
        if (cellsToCreate == 0) return numCreated;
      }

      for (let direction of INTERCARDINALS[options.startingDirection]) {
        _neighbors.set(direction, cell());
        cellsToCreate--;
        numCreated++;
        if (cellsToCreate == 0) return numCreated;
      }

      // TODO: linkNeighbors();
    }

    if (options.extended) {
      // cellsToCreate = options.extended;
      //
      // //TODO - create extended neighbors by in proper direction
      // cellsToCreate -= _neighbors[options.startingDirection].create({
      //   immediate: ,
      //   startingDirection: options.startingDirection
      // });

      // TODO: linkNeighbors();
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
