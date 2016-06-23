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
    const msg = 'should only have 1 cell';

    const actual = biome(1).getRootCell().numberOfNeighbors();
    const expected = 0;

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

