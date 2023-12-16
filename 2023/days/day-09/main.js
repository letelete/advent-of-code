const fs = require('fs');

const parse = (source) =>
  source
    .split('\n')
    .filter(Boolean)
    .map((row) => row.split(' ').map(Number));

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const testOne = parse(fs.readFileSync('test.one.txt', 'utf-8'));
const testTwo = parse(fs.readFileSync('test.two.txt', 'utf-8'));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

/**
 * @remarks I decided to go with non-recursive, in-place solution for this one :)
 */
const processSequence = (sequence) => {
  if (sequence.every((e) => e === 0) || sequence.length < 2) {
    return false;
  }

  for (let i = 0; i < sequence.length - 1; ++i) {
    sequence[i] = sequence[i + 1] - sequence[i];
  }

  sequence.pop();

  return true;
};

const predictNextValue = (sequence) => {
  const history = [];

  do {
    history.push(sequence[sequence.length - 1]);
  } while (processSequence(sequence));

  for (let i = history.length - 2; i >= 0; --i) {
    history[i] += history[i + 1];
  }

  return history[0];
};

const partOne = (data) => {
  return data.map((sequence) => predictNextValue([...sequence])).sum();
};

const partTwo = (data) => {
  return data
    .map((sequence) => [...sequence].reverse())
    .map(predictNextValue)
    .sum();
};

console.log('\x1b[31m--- DATA---\x1b[0m\n', data);
console.log('\x1b[31m--- TEST PART ONE ---\x1b[0m\n', partOne(testOne));
console.log('\x1b[31m--- TEST PART TWO ---\x1b[0m\n', partTwo(testTwo));
console.log();
console.log('\x1b[31m--- PART ONE ---\x1b[0m\n', partOne(data));
console.log('\x1b[31m--- PART TWO ---\x1b[0m\n', partTwo(data));
