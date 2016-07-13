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
const OPPOSITE_DIRECTIONS = {
  north: 'south',
  northEast: 'southWest',
  east: 'west',
  southEast: 'northWest',
  south: 'north',
  southWest: 'northEast',
  west: 'east',
  northWest: 'southEast'
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

  //TODO CHANGE _NEIGHBORS BACK TO OBJECT
  const _neighbors = {
    north: null,
    northEast: null,
    east: null,
    southEast: null,
    south: null,
    southWest: null,
    west: null,
    northWest: null
  };
  Object.seal(_neighbors);

  function numberOfNeighbors() {
    let result = 0;
    for (let neighbor in _neighbors) {
      if (!_neighbors[neighbor]) continue;
      result++;
    }
    return result;
  }
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
  function create(options) {
    let cellsToCreate = 0;
    let numCreated = 0;

    if (!options.startingDirection) options.startingDirection = "east";

    if (options.immediate) {
      cellsToCreate = options.immediate;
      if (cellsToCreate == 0) return numCreated;

      for (let direction of CARDINALS[options.startingDirection]) {
        if (_neighbors[direction]) continue;
        _neighbors[direction] = cell();
        cellsToCreate--;
        numCreated++;
        if (cellsToCreate == 0) {
          this.linkNeighbors();
          return numCreated;
        }
      }

      for (let direction of INTERCARDINALS[options.startingDirection]) {
        if (_neighbors[direction]) continue;
        _neighbors[direction] = cell();
        cellsToCreate--;
        numCreated++;
        if (cellsToCreate == 0) {
          this.linkNeighbors();
          return numCreated;
        }
      }
    }
    else if (options.extended) {
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
      _neighbors[neighbor] = newNeighbors[neighbor];
    }
    return this;
  }
  function linkNeighbors() {
    this.linkNeighborsBackToThis();
  }
  function linkNeighborsBackToThis() {
    for (let direction in _neighbors) {
      if (_neighbors[direction] === null) continue;
      // console.log('= linking ' + direction);
      // console.log('===== before: ' + JSON.stringify(_neighbors[direction].getNeighbors()));
      _neighbors[direction].setNeighbors({
        [OPPOSITE_DIRECTIONS[direction]]: this
      });
      // console.log('===== after:  ' + JSON.stringify(_neighbors[direction].getNeighbors()));
    }
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
    getNeighbors() { return Object.assign({}, _neighbors); },
    judgement() {
      _alive = willLive();
      return this;
    },
    linkNeighbors: linkNeighbors,
    linkNeighborsBackToThis: linkNeighborsBackToThis
  };

  return publicApi;
}
