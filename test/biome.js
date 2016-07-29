import test from 'tape';
import cell from '../src/cell';
import biome from '../src/biome';

export default function testBiome() {
  test('empty biome', assert => {
    const msg = "shouldn't have a root cell";

    const actual = biome().getRootCell();
    const expected = null;

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('biome with 1 cell', assert => {
    const newBiome = biome(1);

    let msg = 'should only create 1 cell';
    let actual = newBiome.getTotalCreated();
    let expected = 1;
    assert.same(actual, expected, msg);

    msg = 'root cell should not have any neighbors';
    actual = newBiome.getRootCell().numberOfNeighbors();
    expected = 0;
    assert.same(actual, expected, msg);

    assert.end();
  });

  test('biome with 9 cells', assert => {
    const newBiome = biome(9);

    let msg = 'should create 9 cells';
    let actual = newBiome.getTotalCreated();
    let expected = 9;
    assert.same(actual, expected, msg);

    msg = 'root cell should have 8 neighbors';
    actual = newBiome.getRootCell().numberOfNeighbors();
    expected = 8;
    assert.same(actual, expected, msg);

    assert.end();
  });

  test('export 2D array of 7 entire cell objects', assert => {
    const msg = 'should export a 2D array with 7 entire cell objects';

    const newBiome = biome(7);
    const neighbors = newBiome.getRootCell().getNeighbors();

    const actual = newBiome.getCellObjectArray();
    const expected = [
      [null, neighbors.north,        null],
      [neighbors.west,      newBiome.getRootCell(), neighbors.east],
      [neighbors.southWest, neighbors.south,        neighbors.southEast]
    ];

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('export 2D array of 9 entire cell objects', assert => {
    const msg = 'should export a 2D array with 9 entire cell objects';

    const newBiome = biome(9);
    const neighbors = newBiome.getRootCell().getNeighbors();

    const actual = newBiome.getCellObjectArray();
    const expected = [
      [neighbors.northWest, neighbors.north,        neighbors.northEast],
      [neighbors.west,      newBiome.getRootCell(), neighbors.east],
      [neighbors.southWest, neighbors.south,        neighbors.southEast]
    ];

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('export 2D array of 7 cell-state objects', assert => {
    const msg = 'should export a proper 2D array with 7 cell-state objects';

    const newBiome = biome(7);

    const actual = newBiome.toArray().map(row => (
      row.map(cell => (cell ? {alive: false} : null))
    ));
    const expected = [
      [null          , {alive: false}, null],
      [{alive: false}, {alive: false}, {alive: false}],
      [{alive: false}, {alive: false}, {alive: false}]
    ];

    assert.same(actual, expected, msg);
    assert.end();
  });

  test('export 2D array of 9 cell-state objects', assert => {
    const msg = 'should export a proper 2D array with 9 cell-state objects';

    const newBiome = biome(9);

    const actual = newBiome.toArray().map(row => (
      row.map(cell => (cell ? {alive: false} : null))
    ));
    const expected = [
      [{alive: false}, {alive: false}, {alive: false}],
      [{alive: false}, {alive: false}, {alive: false}],
      [{alive: false}, {alive: false}, {alive: false}]
    ];

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

