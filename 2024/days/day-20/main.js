function parse(source) {
  return source
    .trim()
    .split('\n')
    .map((e) => e.split(''));
}

function findTilePos(grid, char) {
  const row = grid.findIndex((row) => row.includes(char));
  const col = grid[row].findIndex((col) => col === char);
  return [row, col];
}

const symbols = {
  start: 'S',
  end: 'E',
  wall: '#',
  track: '.',
};

const dirs = {
  orthogonal: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
};

function manhattanDist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function inRange(data, row, col) {
  return row >= 0 && row < data.length && col >= 0 && col < data[0].length;
}

function getPath(grid, start, [endRow, endCol]) {
  const path = [start];
  while (([row, col] = path.at(-1)) && (row !== endRow || col !== endCol)) {
    const [prevRow, prevCol] = path.at(-2) ?? [-1, -1];
    const [nextRow, nextCol] = dirs.orthogonal
      .map(([drow, dcol]) => [row + drow, col + dcol])
      .find(
        ([nextRow, nextCol]) =>
          inRange(grid, nextRow, nextCol) &&
          grid[nextRow][nextCol] !== symbols.wall &&
          (nextRow !== prevRow || nextCol !== prevCol)
      );
    path.push([nextRow, nextCol]);
  }
  return path;
}

function cheat(path, at, duration) {
  const saved = [];
  for (let i = at + 1; i < path.length; ++i) {
    const dist = manhattanDist(path[at], path[i]);
    const save = i - at - dist;
    if (dist <= duration && save > 0) {
      saved.push([save, { from: at, to: i }]);
    }
  }
  return saved;
}

function getAllCheats(path, maxDuration) {
  return path.flatMap((_, at, path) => cheat(path, at, maxDuration));
}

function countOptimalCheats(cheats, minTimeSaved) {
  return cheats.reduce(
    (sum, [timeSaved]) => (timeSaved >= minTimeSaved ? sum + 1 : sum),
    0
  );
}

function part1(data) {
  const path = getPath(
    data,
    findTilePos(data, symbols.start),
    findTilePos(data, symbols.end)
  );
  const cheats = getAllCheats(path, 2);
  return countOptimalCheats(cheats, 100);
}

function part2(data) {
  const path = getPath(
    data,
    findTilePos(data, symbols.start),
    findTilePos(data, symbols.end)
  );
  const cheats = getAllCheats(path, 20);
  return countOptimalCheats(cheats, 100);
}

module.exports = {
  parse,
  part1,
  part2,
  symbols,
  findTilePos,
  getPath,
  cheat,
  getAllCheats,
  countOptimalCheats,
};
