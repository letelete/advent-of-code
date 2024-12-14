function parse(source) {
  const [size, robots] = source.trim().split('\n\n');
  return {
    size: size.split(' ').map(Number),
    robots: robots.split('\n').map((segment) => {
      const [, px, py, vx, vy] = segment.match(
        /p=(-?\d+),(-?\d+)\sv=(-?\d+),(-?\d+)/
      );
      return {
        p: [Number(px), Number(py)],
        v: [Number(vx), Number(vy)],
      };
    }),
  };
}

function mod(a, b) {
  return ((a % b) + b) % b;
}

function wrap(len, p, v, seconds) {
  return mod(p + v * seconds, len);
}

function simulate(lenX, lenY, robots, seconds) {
  return robots.map(({ p: [px, py], v: [vx, vy] }) => {
    return {
      p: [wrap(lenX, px, vx, seconds), wrap(lenY, py, vy, seconds)],
      v: [vx, vy],
    };
  });
}

function countInArea(x0, y0, x1, y1, robots) {
  return robots.filter(
    (robot) =>
      robot.p[0] >= x0 &&
      robot.p[0] <= x1 &&
      robot.p[1] >= y0 &&
      robot.p[1] <= y1
  ).length;
}

function getQuadrants(sizeX, sizeY) {
  const midX = Math.floor(sizeX / 2);
  const midY = Math.floor(sizeY / 2);
  return [
    [
      [0, 0],
      [midX - 1, midY - 1],
    ],
    [
      [midX + 1, 0],
      [sizeX - 1, midY - 1],
    ],
    [
      [0, midY + 1],
      [midX - 1, sizeY - 1],
    ],
    [
      [midX + 1, midY + 1],
      [sizeX - 1, sizeY - 1],
    ],
  ];
}

function createGrid(sizeX, sizeY, robots) {
  return robots
    .reduce(
      (grid, { p: [px, py] }) => {
        grid[py][px] = '#';
        return grid;
      },
      new Array(sizeY).fill(null).map(() => new Array(sizeX).fill('.'))
    )
    .map((row) => row.join(''))
    .join('\n');
}

function getEntropyScore(robots) {
  let score = 0;
  [...robots]
    .sort(({ p: [x1, y1] }, { p: [x2, y2] }) =>
      x1 === x2 ? -1 : y1 === y2 ? -1 : 1
    )
    .forEach(({ p: [x1, y1] }, i, arr) => {
      if (i !== 0) {
        const [x2, y2] = arr[i - 1].p;
        score += ((x1 + 1) / (x2 + 1)) * ((y1 + 1) / (y2 + 1));
      }
    });
  return score;
}

function part1(data) {
  const seconds = 100;
  const robots = simulate(data.size[0], data.size[1], data.robots, seconds);

  const quads = getQuadrants(data.size[0], data.size[1]);
  return quads.reduce(
    (acc, [[x0, y0], [x1, y1]]) => acc * countInArea(x0, y0, x1, y1, robots),
    1
  );
}

function part2(data) {
  let bestMatch = [-1, Infinity, []];
  for (let i = 0; i < data.size[0] * data.size[1]; ++i) {
    const robots = simulate(data.size[0], data.size[1], data.robots, i);
    const entropyScore = getEntropyScore(robots);
    if (entropyScore < bestMatch[1]) {
      bestMatch = [i, entropyScore, robots];
    }
  }

  const grid = createGrid(data.size[0], data.size[1], bestMatch[2]);

  console.log(
    `seconds: ${bestMatch[0]}, entropy: ${bestMatch[1]}\n${grid}\n\n`
  );

  return bestMatch[0];
}

module.exports = { parse, part1, part2 };
