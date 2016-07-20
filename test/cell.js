//https://gist.github.com/ericelliott/bc4c0fb66973202f6680#file-answer-unit-test-questions-js
import test from 'tape';
import {cell, MAX_IMMEDIATE_NEIGHBORS} from '../src/cell';

export default function testCell() {
  test('new cell isAlive', assert => {
    const msg = 'should be dead';

    const actual = cell().isAlive();
    const expected = false;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('new cell beAlive', assert => {
    const msg = 'should come alive';

    const actual = cell().beAlive().isAlive();
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('new cell willLive', assert => {
    const msg = 'should not live';

    const actual = cell().willLive();
    const expected = false;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('adding cell neighbors', assert => {
    const msg = 'neighbors should be added';

    const neighbors = {
      north: cell(),
      northEast: cell(),
      east: cell(),
      southEast: cell(),
      south: cell(),
      southWest: cell(),
      west: cell(),
      northWest: cell()
    };
    const newCell = cell().setNeighbors(neighbors);

    const actual = newCell.getNeighbors();
    const expected = neighbors;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('adding invalid cell neighbors', assert => {
    const msg = 'only valid neighbors should be accepted';

    const newCell = cell();
    const neighbors = { bandit: cell() };

    let actual = false;
    try {
      newCell.setNeighbors(neighbors);
    } catch (e) {
      //setNeighbors threw an error
      actual = true;
    }
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('cell neighbor direct mutation after read', assert => {
    const msg = 'should not be able to mutate a neighbor';

    const newCell = cell();
    const neighbors = { north: cell().beAlive() };
    const originalNorth = Object.assign({}, neighbors.north);

    // Try to directly mutate the neighbor
    newCell.setNeighbors(neighbors).getNeighbors().north = cell();

    const actual = newCell.getNeighbors().north;
    const expected = originalNorth;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('cell neighbor direct mutation after write', assert => {
    const msg = 'should not be able to mutate a neighbor';

    const newCell = cell();
    const neighbors = { north: cell().beAlive() };
    const originalNorth = Object.assign({}, neighbors.north);

    newCell.setNeighbors(neighbors);
    // Try to directly mutate the neighbor
    neighbors.north = cell();

    const actual = newCell.getNeighbors().north;
    const expected = originalNorth;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('cell neighbor replacement', assert => {
    const msg = 'should be able to replace a neighbor';

    const newCell = cell();
    const neighbors = { north: cell() };
    const newNeighbors = { north: cell() };

    newCell.setNeighbors(neighbors).setNeighbors(newNeighbors);

    const actual = newCell.getNeighbors().north;
    const expected = newNeighbors.north;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('number of neighbors', assert => {
    const msg = 'should have 4 neighbors';

    const newCell = cell();
    const neighbors = {
      north: cell().beAlive(),
      northEast: cell(),
      east: cell(),
      southEast: cell()
    };

    const actual = newCell.setNeighbors(neighbors).numberOfNeighbors();
    const expected = 4;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('number of living neighbors', assert => {
    const msg = 'should have 3 living neighbors';

    const newCell = cell();
    const neighbors = {
      north: cell().beAlive(),
      northEast: cell().beAlive(),
      east: cell().beAlive(),
      southEast: cell(),
      south: cell(),
      southWest: cell(),
      west: cell(),
      northWest: cell()
    };

    const actual = newCell.setNeighbors(neighbors).numberOfLivingNeighbors();
    const expected = 3;

    assert.same(actual, expected, msg);
    assert.end();
  });


  // -------------
  // PASSING RULES
  // -------------

  test('rule 1a', assert => {
    const msg = 'live cell with 0 live neighbors should die';

    const neighbors = {
      north: cell(),
      northEast: cell(),
      east: cell(),
      southEast: cell(),
      south: cell(),
      southWest: cell(),
      west: cell(),
      northWest: cell()
    };
    const newCell = cell().beAlive().setNeighbors(neighbors);

    const actual = newCell.judgement().isAlive();
    const expected = false;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('rule 1b', assert => {
    const msg = 'live cell with 1 live neighbor should die';

    const neighbors = {
      north: cell(),
      northEast: cell().beAlive(),
      east: cell(),
      southEast: cell(),
      south: cell(),
      southWest: cell(),
      west: cell(),
      northWest: cell()
    };
    const newCell = cell().beAlive().setNeighbors(neighbors);

    const actual = newCell.judgement().isAlive();
    const expected = false;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('rule 2a', assert => {
    const msg = 'live cell with 2 live neighbors should live';

    const neighbors = {
      north: cell().beAlive(),
      northEast: cell().beAlive(),
      east: cell(),
      southEast: cell(),
      south: cell(),
      southWest: cell(),
      west: cell(),
      northWest: cell()
    };
    const newCell = cell().beAlive().setNeighbors(neighbors);

    const actual = newCell.judgement().isAlive();
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('rule 2b', assert => {
    const msg = 'live cell with 3 live neighbors should live';

    const neighbors = {
      north: cell().beAlive(),
      northEast: cell().beAlive(),
      east: cell().beAlive(),
      southEast: cell(),
      south: cell(),
      southWest: cell(),
      west: cell(),
      northWest: cell()
    };
    const newCell = cell().beAlive().setNeighbors(neighbors);

    const actual = newCell.judgement().isAlive();
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('rule 3', assert => {
    const msg = 'live cell with >3 live neighbors should die';

    const neighbors = {
      north: cell().beAlive(),
      northEast: cell().beAlive(),
      east: cell().beAlive(),
      southEast: cell().beAlive(),
      south: cell(),
      southWest: cell(),
      west: cell(),
      northWest: cell()
    };
    const newCell = cell().beAlive().setNeighbors(neighbors);

    const actual = newCell.judgement().isAlive();
    const expected = false;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('rule 4', assert => {
    const msg = 'dead cell with 3 live neighbors should live';

    const neighbors = {
      north: cell().beAlive(),
      northEast: cell().beAlive(),
      east: cell().beAlive(),
      southEast: cell(),
      south: cell(),
      southWest: cell(),
      west: cell(),
      northWest: cell()
    };
    const newCell = cell().setNeighbors(neighbors);

    const actual = newCell.judgement().isAlive();
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });


  // ----------------------------
  // CREATING IMMEDIATE NEIGHBORS
  // ----------------------------

  test('create 1 immediate neighbor', assert => {
    const msg = 'should create 1 east neighbor';

    const newCell = cell();
    newCell.create({immediate: 1});

    const actual =
      newCell.numberOfNeighbors() === 1 &&
      newCell.getNeighbors().east !== null;
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('create 4 immediate neighbors', assert => {
    const msg = 'should create 4 neighbors in cardinal directions';

    const newCell = cell();
    newCell.create({immediate: 4});

    const actual =
      newCell.numberOfNeighbors() === 4 &&
      newCell.getNeighbors().north !== null &&
      newCell.getNeighbors().east !== null &&
      newCell.getNeighbors().south !== null &&
      newCell.getNeighbors().west !== null;
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('create 4 neighbors', assert => {
    const msg = 'should create 4 neighbors in cardinal directions';

    const newCell = cell();
    newCell.create({cellsToCreate: 4});

    const actual =
      newCell.numberOfNeighbors() === 4 &&
      newCell.getNeighbors().north !== null &&
      newCell.getNeighbors().east !== null &&
      newCell.getNeighbors().south !== null &&
      newCell.getNeighbors().west !== null;
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('create 2 immediate neighbors with direction', assert => {
    const msg = 'should create 2 neighbors in cardinal directions starting north';

    const newCell = cell();
    newCell.create({immediate: 2, startingDirection: "north"});

    const actual =
      newCell.numberOfNeighbors() === 2 &&
      newCell.getNeighbors().north !== null &&
      newCell.getNeighbors().east !== null;
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('create 2 neighbors with direction', assert => {
    const msg = 'should create 2 neighbors in cardinal directions starting north';

    const newCell = cell();
    newCell.create({cellsToCreate: 2, startingDirection: "north"});

    const actual =
      newCell.numberOfNeighbors() === 2 &&
      newCell.getNeighbors().north !== null &&
      newCell.getNeighbors().east !== null;
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('creating immediate neighbors', assert => {
    const msg = 'only create max # of immediate neighbors';

    const actual = cell().create({immediate: MAX_IMMEDIATE_NEIGHBORS + 2});
    const expected = MAX_IMMEDIATE_NEIGHBORS;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('immediate neighbor linking back to self', assert => {
    const msg = 'should link all neighbors back to self';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});

    const north     = newCell.getNeighbors().north;
    const northEast = newCell.getNeighbors().northEast;
    const east      = newCell.getNeighbors().east;
    const southEast = newCell.getNeighbors().southEast;
    const south     = newCell.getNeighbors().south;
    const southWest = newCell.getNeighbors().southWest;
    const west      = newCell.getNeighbors().west;
    const northWest = newCell.getNeighbors().northWest;

    const actual =
      north.getNeighbors().south         === newCell &&
      northEast.getNeighbors().southWest === newCell &&
      east.getNeighbors().west           === newCell &&
      southEast.getNeighbors().northWest === newCell &&
      south.getNeighbors().north         === newCell &&
      southWest.getNeighbors().northEast === newCell &&
      west.getNeighbors().east           === newCell &&
      northWest.getNeighbors().southEast === newCell;
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('immediate neighbor inter-linking', assert => {
    const msg = 'should link all immediate neighbors together';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});

    const north     = newCell.getNeighbors().north;
    const northEast = newCell.getNeighbors().northEast;
    const east      = newCell.getNeighbors().east;
    const southEast = newCell.getNeighbors().southEast;
    const south     = newCell.getNeighbors().south;
    const southWest = newCell.getNeighbors().southWest;
    const west      = newCell.getNeighbors().west;
    const northWest = newCell.getNeighbors().northWest;

    const actual =
      north.getNeighbors().east      === northEast &&
      north.getNeighbors().southEast === east &&
      northEast.getNeighbors().west  === north &&
      northEast.getNeighbors().south === east &&
      east.getNeighbors().northWest  === north &&
      east.getNeighbors().north      === northEast &&
      east.getNeighbors().south      === southEast &&
      east.getNeighbors().southWest  === south &&
      southEast.getNeighbors().north === east &&
      southEast.getNeighbors().west  === south &&
      south.getNeighbors().northEast === east &&
      south.getNeighbors().east      === southEast &&
      south.getNeighbors().west      === southWest &&
      south.getNeighbors().northWest === west &&
      southWest.getNeighbors().east  === south &&
      southWest.getNeighbors().north === west &&
      west.getNeighbors().southEast  === south &&
      west.getNeighbors().south      === southWest &&
      west.getNeighbors().north      === northWest &&
      west.getNeighbors().northEast  === north &&
      northWest.getNeighbors().south === west &&
      northWest.getNeighbors().east  === north &&
      north.getNeighbors().southWest === west &&
      north.getNeighbors().west      === northWest;
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });

  // TODO: Create test to check linking if some neighbors already linked

  // ---------------------------
  // CREATING EXTENDED NEIGHBORS
  // ---------------------------

  test('creating 1 row of extended neighbors', assert => {
    const msg = 'should create 1 row of extended neighbors';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});

    const actual = newCell.create({extended: 16});
    const expected = 16;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('creating 2 rows of extended neighbors', assert => {
    const msg = 'should create 2 rows of extended neighbors';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});

    const actual = newCell.create({extended: 40});
    const expected = 40;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('creating 3 rows of extended neighbors', assert => {
    const msg = 'should create 3 rows of extended neighbors';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});

    const actual = newCell.create({extended: 72});
    const expected = 72;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('creating 4 rows of extended neighbors', assert => {
    const msg = 'should create 4 rows of extended neighbors';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});

    const actual = newCell.create({extended: 112});
    const expected = 112;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('creating 7 rows of extended neighbors', assert => {
    const msg = 'should create 4 rows of extended neighbors';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});

    const actual = newCell.create({extended: 280});
    const expected = 280;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('row 1 neighbor linking', assert => {
    const msg = 'east should have max number of neighbors';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});
    newCell.create({extended: 3, startingDirection: 'east'});
    // 3 extended, because it should create first three as neighbors
    // of east

    const actual = newCell.getNeighbors().east.numberOfNeighbors();
    const expected = MAX_IMMEDIATE_NEIGHBORS;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('row 2 neighbor linking', assert => {
    const msg = 'west of west should have max number of neighbors';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});
    newCell.create({extended: 40, startingDirection: 'east'});

    const actual =
      newCell.getNeighbors().west.getNeighbors().west.numberOfNeighbors();
    const expected = MAX_IMMEDIATE_NEIGHBORS;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('row 7 neighbor linking', assert => {
    const msg = 'northEast-northEast-northEast-northEast should have max number of neighbors';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});
    newCell.create({extended: 280, startingDirection: 'east'});

    const actual =
      newCell
        .getNeighbors().northEast
        .getNeighbors().northEast
        .getNeighbors().northEast
        .getNeighbors().northEast.numberOfNeighbors();
    const expected = MAX_IMMEDIATE_NEIGHBORS;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('linking of extended neighbors from first neighbor', assert => {
    const msg = 'should create all possible links from first neighbor';

    const newCell = cell();
    newCell.create({immediate: MAX_IMMEDIATE_NEIGHBORS});
    newCell.create({extended: 3, startingDirection: "east"});

    const north     = newCell.getNeighbors().east.getNeighbors().north;
    const northEast = newCell.getNeighbors().east.getNeighbors().northEast;
    const east      = newCell.getNeighbors().east.getNeighbors().east;
    const southEast = newCell.getNeighbors().east.getNeighbors().southEast;
    const south     = newCell.getNeighbors().east.getNeighbors().south;

    const actual =
      north.getNeighbors().east      === northEast &&
      north.getNeighbors().southEast === east &&
      northEast.getNeighbors().west  === north &&
      northEast.getNeighbors().south === east &&
      east.getNeighbors().northWest  === north &&
      east.getNeighbors().north      === northEast &&
      east.getNeighbors().south      === southEast &&
      east.getNeighbors().southWest  === south &&
      southEast.getNeighbors().north === east &&
      southEast.getNeighbors().west  === south &&
      south.getNeighbors().northEast === east &&
      south.getNeighbors().east      === southEast;
    const expected = true;

    assert.same(actual, expected, msg);
    assert.end();
  });


  // test('What are you testing?', assert => {
  //   const msg = 'what should it do?';
  //
  //   const actual = ;
  //   const expected = ;
  //
  //   assert.same(actual, expected, msg);
  //   assert.end();
  // });
}
