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
  function create({
    startingDirection = "east",
    cellsToCreate = 0,
    immediate = 0,
    extended = 0
  } = {}) {
    let numCreated = 0;

    if (cellsToCreate > 0) {
      // Create as many immediate neighbors as possible
      numCreated += this.create({
        immediate: cellsToCreate,
        startingDirection
      });
      cellsToCreate -= numCreated;

      // If still more cells to create, recursivly create extended neighbors
      if (cellsToCreate > 0) {
        numCreated += this.create({
          extended: cellsToCreate,
          startingDirection
        });
      }
      // All cells have been recursivly created
      return numCreated;
    }
    else if (immediate > 0) {
      cellsToCreate = immediate;

      for (let direction of CARDINALS[startingDirection]) {
        if (_neighbors[direction]) continue;
        _neighbors[direction] = cell();
        cellsToCreate--;
        numCreated++;
        if (cellsToCreate == 0) {
          this.linkNeighbors();
          return numCreated;
        }
      }

      for (let direction of INTERCARDINALS[startingDirection]) {
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
    else if (extended > 0) {
      // cellsToCreate = extended;
      //
      // //TODO - create extended neighbors by in proper direction

      // (1) Tell cardinal directions to create as many immediate as possible
      // (2) If more to create, tell intercardinals to create as many as possible
      // (3) If more to create, divy up rest to cardinals to create extended


      // cellsToCreate -= _neighbors[startingDirection].create({
      //   immediate: ,
      //   startingDirection: startingDirection
      // });

      // TODO: linkNeighbors();
    }

    // this.linkNeighbors(); // TODO: NEED THIS HERE?
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
    for (let neighbor in _neighbors) {
      if (_neighbors[neighbor] === null) continue;

      this.linkNeighborBackToThis(neighbor);
      this.linkNeighborToNeighbors(neighbor);
    }
  }
  function linkNeighborBackToThis(neighbor) {
    // GUARD NOT WORKING
    // if (_neighbors[neighbor].getNeighbors[OPPOSITE_DIRECTIONS[neighbor]] !== null) {
    //   return;
    // }
    _neighbors[neighbor].setNeighbors({
      [OPPOSITE_DIRECTIONS[neighbor]]: this
    });
  }
  function linkNeighborToNeighbors(neighbor) {
    // Each object key: neighbor from center cell
    // Each fromNeighbor array element: neighbor direction from the object key
    // Each fromCenter array element: neighbor direction from center cell to
    //   get to the corresponding fromNeighbor value
    const NEIGHBOR_LINKS_FOR = {
      north: {
        fromNeighbor: ["east", "southEast", "southWest", "west"],
        fromCenter:   ["northEast", "east", "west", "northWest"]
      },
      northEast: {
        fromNeighbor: ["south", "west"],
        fromCenter:   ["east", "north"]
      },
      east: {
        fromNeighbor: ["south", "southWest", "northWest", "north"],
        fromCenter:   ["southEast", "south", "north", "northEast"]
      },
      southEast: {
        fromNeighbor: ["west", "north"],
        fromCenter:   ["south", "east"]
      },
      south: {
        fromNeighbor: ["west", "northWest", "northEast", "east"],
        fromCenter:   ["southWest", "west", "east", "southEast"]
      },
      southWest: {
        fromNeighbor: ["north", "east"],
        fromCenter:   ["west", "south"]
      },
      west: {
        fromNeighbor: ["north", "northEast", "southEast", "south"],
        fromCenter:   ["northWest", "north", "south", "southWest"]
      },
      northWest: {
        fromNeighbor: ["east", "south"],
        fromCenter:   ["north", "west"]
      }
    };

    const newNeighbors = {};
    NEIGHBOR_LINKS_FOR[neighbor].fromNeighbor.forEach((neighborOfNeighbor, index) => {
      // GUARD NOT WORKING
      // if (_neighbors[neighbor].getNeighbors[neighborOfNeighbor] !== null) {
      //   return;
      // }
      newNeighbors[neighborOfNeighbor] =
        _neighbors[NEIGHBOR_LINKS_FOR[neighbor].fromCenter[index]]
    });
    _neighbors[neighbor].setNeighbors(newNeighbors);
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
    linkNeighborBackToThis: linkNeighborBackToThis,
    linkNeighborToNeighbors: linkNeighborToNeighbors
  };

  return publicApi;
}
