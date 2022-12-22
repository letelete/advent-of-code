const fs = require('fs');

const parse = (source) =>
  source
    .split('\n\n')
    .filter(Boolean)
    .map((chunk) => chunk.split('\n').filter(Boolean))
    .map((pair) => pair.map(JSON.parse));

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const test = parse(fs.readFileSync('test.txt', 'utf-8'));

console.log(test);

const isNumber = (x) => typeof x === 'number';

const isArray = (x) => Array.isArray(x);

const packetsEqual = (p1, p2) => JSON.stringify(p1) === JSON.stringify(p2);

const STATES = Object.freeze({ CONTINUE: -1, INVALID: 0, VALID: 1 });

const compare = (a, b) => {
  const [aIsNumber, bIsNumber] = [a, b].map(isNumber);
  const [aIsArray, bIsArray] = [a, b].map(isArray);

  if (aIsNumber && bIsNumber) {
    if (a < b) return STATES.VALID;
    if (a > b) return STATES.INVALID;
    return STATES.CONTINUE;
  }

  if (aIsArray && bIsArray) {
    const [aLen, bLen] = [a, b].map((e) => e.length);
    for (let i = 0; i < Math.max(aLen, bLen); ++i) {
      const [ai, bi] = [a[i], b[i]];
      if (ai === undefined || bi === undefined) {
        return aLen < bLen ? STATES.VALID : STATES.INVALID;
      }
      const state = compare(ai, bi);
      if (state !== STATES.CONTINUE) return state;
    }
  }

  if (aIsNumber) return compare([a], b);
  if (bIsNumber) return compare(a, [b]);

  return STATES.CONTINUE;
};

const validateOrder = (pair) => {
  return compare(pair[0], pair[1]) !== STATES.INVALID;
};

const stateComparator = (a, b) => {
  switch (compare(a, b)) {
    case STATES.VALID:
      return -1;
    case STATES.INVALID:
      return 1;
  }
  return 0;
};

const part1 = (data) => {
  return data
    .map(validateOrder)
    .map((isValid, index) => (isValid ? index + 1 : 0))
    .reduce((a, b) => a + b);
};

const part2 = (data) => {
  const dividers = [[[2]], [[6]]];
  const sorted = [...data.flat(), ...dividers].sort(stateComparator);
  return dividers
    .map((p1) => sorted.findIndex((p2) => packetsEqual(p1, p2)) + 1)
    .reduce((a, b) => a * b);
};

console.log(part1(data));
console.log(part2(data));
