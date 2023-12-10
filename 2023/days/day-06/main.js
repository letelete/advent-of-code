const fs = require('fs');

const parse = (source) => {
  return source
    .split('\n')
    .filter(Boolean)
    .map((e) =>
      e
        .split(':')[1]
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((e) => Number(e))
    );
};

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const testOne = parse(fs.readFileSync('test.one.txt', 'utf-8'));
const testTwo = parse(fs.readFileSync('test.two.txt', 'utf-8'));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

const getLeastMostHoldTime = (time, distance) => {
  const delta = Math.pow(time, 2) - 4 * distance;
  const least = Math.ceil((-time + Math.sqrt(delta)) / -2);
  const most = Math.floor((-time - Math.sqrt(delta)) / -2);

  return { least, most };
};

const partOne = (data) => {
  const [times, distances] = data;
  return times
    .map((time, i) => getLeastMostHoldTime(time, distances[i]))
    .map(({ least, most }) => most + 1 - least)
    .product();
};

const partTwo = (data) => {
  const times = [Number(data[0].join(''))];
  const distances = [Number(data[1].join(''))];

  return times
    .map((time, i) => getLeastMostHoldTime(time, distances[i]))
    .map(({ least, most }) => most + 1 - least)
    .product();
};

console.log('\x1b[31m--- DATA---\x1b[0m\n', data);
console.log('\x1b[31m--- TEST PART ONE ---\x1b[0m\n', partOne(testOne));
console.log('\x1b[31m--- TEST PART TWO ---\x1b[0m\n', partTwo(testTwo));
console.log();
console.log('\x1b[31m--- PART ONE ---\x1b[0m\n', partOne(data));
console.log('\x1b[31m--- PART TWO ---\x1b[0m\n', partTwo(data));
