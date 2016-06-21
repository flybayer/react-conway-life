//https://gist.github.com/ericelliott/bc4c0fb66973202f6680#file-answer-unit-test-questions-js
import test from 'tape';
import cell from '../src/cell';

test('new cell isAlive', assert => {
  const msg = 'should be dead'

  const actual = cell().isAlive();
  const expected = false;

  assert.same(actual, expected, msg);
  assert.end();
});

test('new cell beAlive', assert => {
  const msg = 'should come alive'

  const actual = cell().beAlive().isAlive();
  const expected = true;

  assert.same(actual, expected, msg);
  assert.end();
});

test('new cell willLive', assert => {
  const msg = 'should not live'

  const actual = cell().willLive();
  const expected = false;

  assert.same(actual, expected, msg);
  assert.end();
});

test('adding cell neighbors', assert => {
  const msg = 'neighbors should be added'

  const neighbors = {
    top: cell(),
    topRight: cell(),
    right: cell(),
    bottomRight: cell(),
    bottom: cell(),
    bottomLeft: cell(),
    left: cell(),
    topLeft: cell()
  };
  const newCell = cell().setNeighbors(neighbors);

  const actual = newCell.getNeighbors();
  const expected = neighbors;

  assert.same(actual, expected, msg);
  assert.end();
});

test('adding invalid cell neighbors', assert => {
  const msg = 'only valid neighbors should be accepted'

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

test('cell neighbor direct mutation', assert => {
  const msg = 'should not be able to mutate a neighbor'

  const newCell = cell();
  const neighbors = { top: cell() };

  // Try to directly mutate the neighbor
  newCell.setNeighbors(neighbors).getNeighbors().top = cell();

  const actual = newCell.getNeighbors().top;
  const expected = neighbors.top;

  assert.same(actual, expected, msg);
  assert.end();
});

test('cell neighbor replacement', assert => {
  const msg = 'should be able to replace a neighbor'

  const newCell = cell();
  const neighbors = { top: cell() };
  const newNeighbors = { top: cell() };

  newCell.setNeighbors(neighbors).setNeighbors(newNeighbors);

  const actual = newCell.getNeighbors().top;
  const expected = newNeighbors.top;

  assert.same(actual, expected, msg);
  assert.end();
});

test('number of living neighbors', assert => {
  const msg = 'should have 3 living neighbors'

  const newCell = cell();
  const neighbors = {
    top: cell().beAlive(),
    topRight: cell().beAlive(),
    right: cell().beAlive(),
    bottomRight: cell(),
    bottom: cell(),
    bottomLeft: cell(),
    left: cell(),
    topLeft: cell()
  };

  const actual = newCell.setNeighbors(neighbors).numberOfLivingNeighbors();
  const expected = 3;

  assert.same(actual, expected, msg);
  assert.end();
});

test('rule 1a', assert => {
  const msg = 'live cell with 0 live neighbors should die'

  const neighbors = {
    top: cell(),
    topRight: cell(),
    right: cell(),
    bottomRight: cell(),
    bottom: cell(),
    bottomLeft: cell(),
    left: cell(),
    topLeft: cell()
  };
  const newCell = cell().beAlive().setNeighbors(neighbors);

  const actual = newCell.judgement().isAlive();
  const expected = false;

  assert.same(actual, expected, msg);
  assert.end();
});

test('rule 1b', assert => {
  const msg = 'live cell with 1 live neighbor should die'

  const neighbors = {
    top: cell(),
    topRight: cell().beAlive(),
    right: cell(),
    bottomRight: cell(),
    bottom: cell(),
    bottomLeft: cell(),
    left: cell(),
    topLeft: cell()
  };
  const newCell = cell().beAlive().setNeighbors(neighbors);

  const actual = newCell.judgement().isAlive();
  const expected = false;

  assert.same(actual, expected, msg);
  assert.end();
});

test('rule 2a', assert => {
  const msg = 'live cell with 2 live neighbors should live'

  const neighbors = {
    top: cell().beAlive(),
    topRight: cell().beAlive(),
    right: cell(),
    bottomRight: cell(),
    bottom: cell(),
    bottomLeft: cell(),
    left: cell(),
    topLeft: cell()
  };
  const newCell = cell().beAlive().setNeighbors(neighbors);

  const actual = newCell.judgement().isAlive();
  const expected = true;

  assert.same(actual, expected, msg);
  assert.end();
});

test('rule 2b', assert => {
  const msg = 'live cell with 3 live neighbors should live'

  const neighbors = {
    top: cell().beAlive(),
    topRight: cell().beAlive(),
    right: cell().beAlive(),
    bottomRight: cell(),
    bottom: cell(),
    bottomLeft: cell(),
    left: cell(),
    topLeft: cell()
  };
  const newCell = cell().beAlive().setNeighbors(neighbors);

  const actual = newCell.judgement().isAlive();
  const expected = true;

  assert.same(actual, expected, msg);
  assert.end();
});

test('rule 3', assert => {
  const msg = 'live cell with >3 live neighbors should die'

  const neighbors = {
    top: cell().beAlive(),
    topRight: cell().beAlive(),
    right: cell().beAlive(),
    bottomRight: cell().beAlive(),
    bottom: cell(),
    bottomLeft: cell(),
    left: cell(),
    topLeft: cell()
  };
  const newCell = cell().beAlive().setNeighbors(neighbors);

  const actual = newCell.judgement().isAlive();
  const expected = false;

  assert.same(actual, expected, msg);
  assert.end();
});

test('rule 4', assert => {
  const msg = 'dead cell with 3 live neighbors should live'

  const neighbors = {
    top: cell().beAlive(),
    topRight: cell().beAlive(),
    right: cell().beAlive(),
    bottomRight: cell(),
    bottom: cell(),
    bottomLeft: cell(),
    left: cell(),
    topLeft: cell()
  };
  const newCell = cell().setNeighbors(neighbors);

  const actual = newCell.judgement().isAlive();
  const expected = true;

  assert.same(actual, expected, msg);
  assert.end();
});

// test('What are you testing?', assert => {
//   const msg = 'what should it do?'
//
//   const actual = ;
//   const expected = ;
//
//   assert.same(actual, expected, msg);
//   assert.end();
// });
