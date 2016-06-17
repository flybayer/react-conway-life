//https://gist.github.com/ericelliott/bc4c0fb66973202f6680#file-answer-unit-test-questions-js
import test from 'tape';
import cell from '../js/cell';

test('new cell is dead', assert => {
  const actual = cell().isAlive();
  const expected = false;

  assert.equal(actual, expected,
    'a new cell should not be alive');

  assert.end();
});




// test('What component aspect are you testing?', assert => {
//   const actual = 'What is the actual output?';
//   const expected = 'What is the expected output?';
//
//   assert.equal(actual, expected,
//     'What should the feature do?');
//
//   assert.end();
// });
