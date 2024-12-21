function parse(source) {
  return source
    .trim()
    .split('\n')
    .map((e) => e.split(''));
}

function findTile(grid, char) {
  const row = grid.findIndex((row) => row.includes(char));
  return [row, grid[row].indexOf(char)];
}

const symbols = { start: 'S', end: 'E', wall: '#', track: '.' };
const dirs = {
  orthogonal: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
};

function inRange(data, row, col) {
  return row >= 0 && row < data.length && col >= 0 && col < data[0].length;
}

const hash = (row, col) => `${row},${col}`;

function bfs(grid, start, end, visited, trackPath, memo = new Map()) {
  const startKey = `${hash(...start)}->${hash(...end)}`;
  if (memo.has(startKey)) return memo.get(startKey);

  const q = [[0, start]],
    source = new Map();

  while (q.length) {
    const [steps, [row, col]] = q.shift();
    const key = hash(row, col);
    if (visited.has(key)) continue;
    visited.add(key);

    if (row === end[0] && col === end[1]) {
      if (!trackPath) {
        memo.set(startKey, steps);
        return steps;
      }
      const path = [[row, col]];
      let head = source.get(key);
      while (head) {
        path.push(head.split(',').map(Number));
        head = source.get(head);
      }
      const result = [steps, path.reverse()];
      memo.set(startKey, result);
      return result;
    }

    dirs.orthogonal.forEach(([drow, dcol]) => {
      const [nextRow, nextCol] = [row + drow, col + dcol];
      if (
        inRange(grid, nextRow, nextCol) &&
        grid[nextRow][nextCol] !== symbols.wall &&
        !visited.has(hash(nextRow, nextCol))
      ) {
        q.push([steps + 1, [nextRow, nextCol]]);
        source.set(hash(nextRow, nextCol), key);
      }
    });
  }
  memo.set(startKey, -1);
  return -1;
}

function part1(data) {
  const end = findTile(data, symbols.end),
    start = findTile(data, symbols.start);
  const memo = new Map();
  const [minSteps, path] = bfs(data, start, end, new Set(), true, memo);

  const visited = new Set(),
    saves = new Map();
  path.forEach(([row, col], steps) => {
    visited.add(hash(row, col));
    dirs.orthogonal.forEach(([drow, dcol]) => {
      const [nextRow, nextCol] = [row + drow, col + dcol];
      const nextKey = hash(nextRow, nextCol);
      if (
        inRange(data, nextRow, nextCol) &&
        data[nextRow][nextCol] === symbols.wall &&
        !visited.has(nextKey)
      ) {
        const bfsres = bfs(
          data,
          [nextRow, nextCol],
          end,
          new Set(visited),
          false,
          memo
        );
        if (bfsres !== -1) {
          const candidate = steps + bfsres + 1;
          if (candidate < minSteps)
            saves.set(candidate, (saves.get(candidate) ?? 0) + 1);
        }
      }
    });
  });

  return [
    minSteps,
    [...saves.entries()]
      .filter(([k]) => minSteps - k >= 100)
      .reduce((sum, [_, v]) => sum + v, 0),
  ];
}

function part2() {
  return null;
}

module.exports = { parse, part1, part2 };
