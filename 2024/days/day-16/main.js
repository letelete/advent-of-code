const fs = require('fs');

function parse(source) {
  return source
    .trim()
    .split('\n')
    .map((e) => e.split(''));
}

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((col, value) => col * value, 1);
};

Array.prototype.equals = function (arr) {
  return (
    this.length === arr.length && this.every((e, i) => Object.is(e, arr[i]))
  );
};

const CHAR_WALL = '#';
const CHAR_START = 'S';
const CHAR_END = 'E';
const DIR_EAST = 2;

const dirs = {
  orthogonal: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
};

function mod(a, b) {
  return ((a % b) + b) % b;
}

const clockwise = (dir) => {
  return mod(dir + 1, dirs.orthogonal.length);
};

const counterclockwise = (dir) => {
  return mod(dir - 1, dirs.orthogonal.length);
};

function inRange(grid, row, col) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

function findTile(grid, char) {
  const row = grid.findIndex((row) => row.includes(char));
  const col = grid[row].findIndex((col) => col === char);

  return [row, col];
}

const findMinScore = (grid, startRow, startCol, startDir, endRow, endCol) => {
  const visited = new Set();
  const distance = Array.from({ length: grid.length }, () =>
    new Array(grid[0].length).fill(Infinity)
  );
  distance[startRow][startCol] = 0;

  const q = [[0, startRow, startCol, startDir]];

  while (q.length) {
    q.sort(([acost], [bcost]) => bcost - acost);

    const [cost, row, col, dir] = q.pop();
    visited.add(`${row},${col}`);

    if (row === endRow && col === endCol) {
      break;
    }

    [
      [0, dir],
      [1000, clockwise(dir)],
      [1000, counterclockwise(dir)],
    ].forEach(([weight, dir]) => {
      const [drow, dcol] = dirs.orthogonal[dir];
      if (
        inRange(grid, row + drow, col + dcol) &&
        grid[row + drow][col + dcol] !== CHAR_WALL &&
        !visited.has(`${row + drow},${col + dcol}`)
      ) {
        const nextCost = cost + weight + 1;

        if (nextCost < distance[row + drow][col + dcol]) {
          distance[row + drow][col + dcol] = nextCost;
          q.push([nextCost, row + drow, col + dcol, dir]);
        }
      }
    });
  }

  return distance;
};

const findMinScoreRoutes = (grid, startRow, startCol, endRow, endCol) => {
  const routes = [];
  const visited = new Map();

  const q = [[[startRow, startCol], [[startRow, startCol]], 0, 0]];
  while (q.length > 0) {
    const [[row, col], history, currScore, currDir] = q.shift();

    if (row === endRow && col === endCol) {
      routes.push([history, currScore]);
      continue;
    }

    const key = `${row},${col},${currDir}`;
    if (visited.has(key) && visited.get(key) < currScore) {
      continue;
    }

    visited.set(key, currScore);

    dirs.orthogonal.forEach(([drow, dcol], dir) => {
      const nextRow = row + drow;
      const nextCol = col + dcol;

      if (
        grid[nextRow] &&
        grid[nextRow][nextCol] !== CHAR_WALL &&
        !history.some(([hrow, hcol]) => hrow === nextRow && hcol === nextCol)
      ) {
        if (dir === currDir) {
          q.push([
            [nextRow, nextCol],
            [...history, [nextRow, nextCol]],
            currScore + 1,
            dir,
          ]);
        } else {
          q.push([[row, col], history, currScore + 1000, dir]);
        }
      }
    });
  }

  const minScore = Math.min(...routes.map(([_, score]) => score));
  return routes.filter(([_, score]) => score === minScore);
};

function part1(data) {
  const [startRow, startCol] = findTile(data, CHAR_START);
  const [endRow, endCol] = findTile(data, CHAR_END);

  return findMinScore(data, startRow, startCol, DIR_EAST, endRow, endCol)[
    endRow
  ][endCol];
}

function part2(data) {
  const [startRow, startCol] = findTile(data, CHAR_START);
  const [endRow, endCol] = findTile(data, CHAR_END);

  const uniqueTiles = new Set(
    findMinScoreRoutes(data, startRow, startCol, endRow, endCol)
      .flatMap(([route]) => route)
      .map(([row, col]) => `${row},${col}`)
  );

  return uniqueTiles.size;
}

module.exports = { parse, part1, part2 };
