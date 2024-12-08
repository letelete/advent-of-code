function parse(source) {
  return source.split("\n").filter(Boolean);
}

const dirs = {
  orthogonal: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
  diagonal: [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ],
  all() {
    return [...this.orthogonal, ...this.diagonal];
  },
};

function* createGridTraversal(grid, [initialRow, initialCol] = [0, 0]) {
  for (let row = initialRow; row < grid.length; ++row) {
    for (let col = initialCol; col < grid[row].length; ++col) {
      yield [row, col];
    }
  }
}

function getGridValue(grid, [row, col]) {
  return grid[row][col];
}

function reflection([x, y]) {
  return [x * -1, y * -1];
}

function Pos(initialRow, initialCol) {
  let row = initialRow;
  let col = initialCol;

  return {
    get current() {
      return [row, col];
    },
    incr([incrRow, incrCol]) {
      row += incrRow;
      col += incrCol;
    },
    toIncr([incrRow, incrCol]) {
      return Pos(row + incrRow, col + incrCol);
    },
    inRange(minRow, maxRow, minCol, maxCol) {
      return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
    },
  };
}

function matchesPattern(grid, [row, col], [dirRow, dirCol], pattern) {
  const pos = Pos(row, col);

  for (const next of pattern) {
    if (
      !pos.inRange(0, grid.length - 1, 0, grid[0].length - 1) ||
      getGridValue(grid, pos.current) !== next
    ) {
      return false;
    }
    pos.incr([dirRow, dirCol]);
  }

  return true;
}

function countXmasWords(grid, [row, col]) {
  return dirs
    .all()
    .filter((dir) => matchesPattern(grid, [row, col], dir, "XMAS".split("")))
    .length;
}

function hasShapeOfXmas(grid, [row, col]) {
  const pos = Pos(row, col);

  return (
    getGridValue(grid, pos.current) === "A" &&
    dirs.diagonal.filter(
      (dir) =>
        matchesPattern(grid, pos.toIncr(dir).current, dir, ["M"]) &&
        matchesPattern(grid, pos.toIncr(reflection(dir)).current, dir, ["S"])
    ).length === 2
  );
}

function part1(data) {
  let count = 0;
  for (const pos of createGridTraversal(data)) {
    count += countXmasWords(data, pos);
  }
  return count;
}

function part2(data) {
  let count = 0;
  for (const pos of createGridTraversal(data)) {
    if (hasShapeOfXmas(data, pos)) {
      count++;
    }
  }
  return count;
}

module.exports = { parse, part1, part2 };
