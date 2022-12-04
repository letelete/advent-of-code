const fs = require('fs');

const aContainsB = (a, b) => a[0] <= b[0] && a[1] >= b[1];

const segmentContained = ([a, b]) => aContainsB(a, b) || aContainsB(b, a);

const segmentsOverlap = ([a, b]) => a[1] >= b[0] && b[1] >= a[0];

const input = fs
  .readFileSync('in.txt', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((p) => p.split(','))
  .map(([p1, p2]) => [p1.split('-').map(Number), p2.split('-').map(Number)]);

console.log(input.filter(segmentContained).length);
console.log(input.filter(segmentsOverlap).length);
