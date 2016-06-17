//https://gist.github.com/ericelliott/bc4c0fb66973202f6680#file-answer-unit-test-questions-js
import test from 'tape';
import cell from '../src/cell';

test('new cell', assert => {
  const msg = 'should be dead'

  const actual = cell().isAlive();
  const expected = false;

  assert.same(actual, expected, msg);
  assert.end();
});
