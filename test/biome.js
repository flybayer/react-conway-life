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

  test('biome with 8 cells', assert => {
    const newBiome = biome(8);

    let msg = 'should only create 8 cells';
    let actual = newBiome.getTotalCreated();
    let expected = 8;
    assert.same(actual, expected, msg);

    msg = 'root cell should have 7 neighbors';
    actual = newBiome.getRootCell().numberOfNeighbors();
    expected = 7;
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

