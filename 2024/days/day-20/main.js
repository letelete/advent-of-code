function parse(source) {
  return source
    .trim()
    .split('\n')
    .map((e) => e.split(''));
}

function findTile(grid, char) {
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

function inRange(data, row, col) {
  return row >= 0 && row < data.length && col >= 0 && col < data[0].length;
}

function hash(row, col) {
  return `${row},${col}`;
}

function bfs(grid, start, end, visited, trackPath) {
  const q = [[0, start]];
  const source = new Map();

  while (q.length) {
    const [steps, [row, col]] = q.shift();
    if (visited.has(hash(row, col))) {
      continue;
    }
    visited.add(hash(row, col));

    if (row === end[0] && col === end[1]) {
      if (!trackPath) {
        return steps;
      }
      const path = [[row, col]];
      let head = source.get(hash(row, col));
      while (head) {
        path.push(head.split(',').map(Number));
        head = source.get(head);
      }
      return [steps, [...path].reverse()];
    }

    dirs.orthogonal.forEach(([drow, dcol]) => {
      const [nextRow, nextCol] = [row + drow, col + dcol];
      if (
        inRange(grid, nextRow, nextCol) &&
        grid[nextRow][nextCol] !== symbols.wall &&
        !visited.has(hash(nextRow, nextCol))
      ) {
        q.push([steps + 1, [nextRow, nextCol]]);
        source.set(hash(nextRow, nextCol), hash(row, col));
      }
    });
  }

  return -1;
}

function part1(data) {
  const end = findTile(data, symbols.end);

  const [minSteps, path] = bfs(
    data,
    findTile(data, symbols.start),
    end,
    new Set(),
    true
  );

  const visited = new Set();
  const saves = new Map();
  console.log({ path });
  path.forEach(([row, col], steps) => {
    visited.add(hash(row, col));
    dirs.orthogonal.forEach(([drow, dcol]) => {
      const [nextRow, nextCol] = [row + drow, col + dcol];
      const nextHash = hash(nextRow, nextCol);
      if (
        inRange(data, nextRow, nextCol) &&
        data[nextRow][nextCol] === symbols.wall &&
        !visited.has(nextHash)
      ) {
        const bfsres = bfs(
          data,
          [nextRow, nextCol],
          end,
          new Set(...visited),
          false
        );
        if (bfsres !== -1) {
          const candidate = steps + bfsres + 1;
          if (candidate < minSteps) {
            saves.set(candidate, (saves.get(candidate) ?? 0) + 1);
          }
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

function part2(data) {
  return null;
}

module.exports = { parse, part1, part2 };
