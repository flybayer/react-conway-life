export const MAX_IMMEDIATE_NEIGHBORS = 8;

// Directions to loop through based on starting direction
const CARDINALS = {
  east:  ["east", "south", "west", "north"],
  south: ["south", "west", "north", "east"],
  west:  ["west", "north", "east", "south"],
  north: ["north", "east", "south", "west"]
};
// Directions to loop through based on starting direction
const INTERCARDINALS = {
  east:  ["southEast", "southWest", "northWest", "northEast"],
  south: ["southWest", "northWest", "northEast", "southEast"],
  west:  ["northWest", "northEast", "southEast", "southWest"],
  north: ["northEast", "southEast", "southWest", "northWest"]
}
//Example usage is creating links from immediate neighbor back to center
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
    let cellsLeftToCreate = 0;
    let numCreated = 0;

    if (!(startingDirection in CARDINALS)) {
      throw new Error("Starting direction: '" + startingDirection + "'. Starting direction must be a cardinal direction")
    }

    if (cellsToCreate > 0) {
      cellsLeftToCreate = cellsToCreate;

      // Create as many immediate neighbors as possible
      numCreated += this.create({
        immediate: cellsLeftToCreate,
        startingDirection
      });
      cellsLeftToCreate -= numCreated;

      // If still more cells to create, recursivly create extended neighbors
      if (cellsLeftToCreate > 0) {
        numCreated += this.create({
          extended: cellsLeftToCreate,
          startingDirection
        });
      }
      // All cells have been recursivly created
      return numCreated;
    }
    else if (immediate > 0) {
      cellsLeftToCreate = immediate;

      for (let direction of CARDINALS[startingDirection]) {
        if (_neighbors[direction]) continue;
        _neighbors[direction] = cell();
        cellsLeftToCreate--;
        numCreated++;
        if (cellsLeftToCreate === 0) break;
      }

      if (cellsLeftToCreate > 0) {
        for (let direction of INTERCARDINALS[startingDirection]) {
          if (_neighbors[direction]) continue;
          _neighbors[direction] = cell();
          cellsLeftToCreate--;
          numCreated++;
          if (cellsLeftToCreate === 0) break;
        }
      }

      this.linkNeighbors();
      return numCreated;
    }
    else if (extended > 0) {
      if (numberOfNeighbors() < MAX_IMMEDIATE_NEIGHBORS) {
        throw new Error("Must create max immediate neighbors before creating extended ones");
      }

      cellsToCreate = extended;
      let toCreateThisBatch = extended;

      // console.log("\n===================================");
      // console.log("     START OF EXTENDED ROUTINE ");
      // console.log("         creating: " + toCreateThisBatch);
      // console.log("===================================");

      // -----------------------------------------------------------------
      // 1. Have cardinal directions create as many immediates as possible
      // -----------------------------------------------------------------
      // console.log("=== IMMEDIATE CARDINALS ===> " + toCreateThisBatch);
      CARDINALS[startingDirection].forEach((direction, index) => {
        // console.log("creating " + direction + ": " + toCreateThisBatch + " immediate");

        if (toCreateThisBatch === 0) return;

        const created = _neighbors[direction].create({
          immediate: toCreateThisBatch,
          startingDirection
        });
        numCreated += created;
        toCreateThisBatch -= created;
        // console.log("created: " + created);
      });

      if (cellsToCreate - numCreated <= 0) {
        // console.log("***********************************");
        // console.log("     END OF EXTENDED ROUTINE ");
        // console.log("         created: " + numCreated);
        // console.log("***********************************\n");
        return numCreated;
      }


      // ----------------------------------------------------------------------
      // 2. Have intercardinal directions create as many immediates as possible
      // ----------------------------------------------------------------------
      toCreateThisBatch = cellsToCreate - numCreated;

      // console.log("=== IMMEDIATE INTERCARDINALS ===> " + toCreateThisBatch);
      INTERCARDINALS[startingDirection].forEach((direction, index) => {
        // console.log("creating " + direction + ": " + toCreateThisBatch + " immediate");

        if (toCreateThisBatch === 0) return;

        const created = _neighbors[direction].create({
          immediate: toCreateThisBatch,
          startingDirection
        });
        numCreated += created;
        toCreateThisBatch -= created;
        // console.log("created: " + created);
      });

      if (cellsToCreate - numCreated <= 0) {
        // console.log("***********************************");
        // console.log("     END OF EXTENDED ROUTINE ");
        // console.log("         created: " + numCreated);
        // console.log("***********************************\n");
        return numCreated;
      }


      // -----------------------------------------------------------------
      // 3. Have cardinal directions create the rest as extended neighbors
      // -----------------------------------------------------------------
      toCreateThisBatch = cellsToCreate - numCreated;

      // console.log("=== EXTENDED CARDINALS ===> " + toCreateThisBatch);
      CARDINALS[startingDirection].forEach((direction, index) => {
        let numThisDirection = Math.floor(toCreateThisBatch / 4);
        // Spread out the remainder among the directions
        if (toCreateThisBatch % 4 > index) numThisDirection++;

        // console.log("\n * creating " + direction + ": " + numThisDirection + " EXTENDED");

        if (numThisDirection === 0) return;

        const created = _neighbors[direction].create({
          extended: numThisDirection,
          startingDirection: direction
        });
        numCreated += created;
        // console.log("created: " + created);
      });

      // console.log("***********************************");
      // console.log("     END OF EXTENDED ROUTINE ");
      // console.log("         created: " + numCreated);
      // console.log("***********************************\n");

      return numCreated;
    }

    throw new Error("Should never reach this place in cell().create()");
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

      _neighbors[neighbor].setNeighbors(
        Object.assign({},
          this.getNeighborLinkBackToThis(neighbor),
          this.getLinksFromNeighborToNeighbors(neighbor)
        )
      );
    }
  }
  function getNeighborLinkBackToThis(neighbor) {
    if (_neighbors[neighbor].getNeighbors[OPPOSITE_DIRECTIONS[neighbor]]) {
      //Neighbor link already exists
      return {};
    }
    return {[OPPOSITE_DIRECTIONS[neighbor]]: this};
  }
  function getLinksFromNeighborToNeighbors(neighbor) {
    const newNeighbors = {};

    NEIGHBOR_LINKS_FOR[neighbor].fromNeighbor.forEach((neighborOfNeighbor, index) => {
      if (_neighbors[neighbor].getNeighbors[neighborOfNeighbor]) {
        //Neighbor link already exists
        return;
      }
      newNeighbors[neighborOfNeighbor] =
        _neighbors[NEIGHBOR_LINKS_FOR[neighbor].fromCenter[index]]
    });
    return newNeighbors;
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
    getNeighborLinkBackToThis: getNeighborLinkBackToThis,
    getLinksFromNeighborToNeighbors: getLinksFromNeighborToNeighbors
  };

  return publicApi;
}
