const { sign } = require('crypto');
const fs = require('fs');

const moves = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const minMax = (arr) => [Math.min(...arr) - 1, Math.max(...arr) + 1];

const bound = ([min, max], offset) => [min - offset, max + offset];

const parse = (source) =>
  source
    .split('\n')
    .filter(Boolean)
    .map((e) => e.split(',').map(Number));

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const test = parse(fs.readFileSync('test.txt', 'utf-8'));

const part1 = (data) => {
  const dict = {};

  data.forEach(([x, y, z]) => {
    if (!dict[x]) dict[x] = {};
    if (!dict[x][y]) dict[x][y] = {};
    if (!dict[x][y][z]) dict[x][y][z] = {};
    dict[x][y][z] = 1;
  });

  const sumSidesAt = ([x, y, z]) => {
    return moves.reduce(
      (sum, [a, b, c]) => sum + (dict[x + a]?.[y + b]?.[z + c] || 0),
      0
    );
  };

  return data.reduce((total, pos) => total + 6 - sumSidesAt(pos), 0);
};

const part2 = (data) => {
  const [minX, maxX] = bound(minMax(data.map(([x]) => x)), 1);
  const [minY, maxY] = bound(minMax(data.map(([_, y]) => y)), 1);
  const [minZ, maxZ] = bound(minMax(data.map(([_, __, z]) => z)), 1);

  const outOfBounds = ([x, y, z]) => {
    return x < minX || y < minY || z < minZ || x > maxX || y > maxY || z > maxZ;
  };

  const hash = (to, from) => `${to.toString()};${from.toString()}`;

  const painted = new Set(data.map((e) => e.toString()));
  const startFrom = [minX, minY, minZ];
  const visited = new Set();
  const q = [startFrom];

  let count = 0;

  while (q.length) {
    const to = q.shift();

    if (painted.has(to.toString())) {
      count += 1;
      continue;
    }

    moves
      .map(([a, b, c]) => [[to[0] + a, to[1] + b, to[2] + c], to])
      .map(([to, from]) => [to, hash(to, from)])
      .forEach(([to, hashed]) => {
        if (!outOfBounds(to) && !visited.has(hashed)) {
          visited.add(hashed);
          q.push(to);
        }
      });
  }

  return count;
};

console.log(part1(data));
console.log(part2(data));
