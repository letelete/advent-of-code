const fs = require("fs");

const parse = (source) => source.split("\n").filter(Boolean);

const data = parse(fs.readFileSync("in.txt", "utf-8"));
const testOne = parse(fs.readFileSync("test.one.txt", "utf-8"));
const testTwo = parse(fs.readFileSync("test.two.txt", "utf-8"));

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

const getGridValue = (grid, [row, col]) => grid[row][col];

const reflection = ([x, y]) => [x * -1, y * -1];

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

const countXmasWords = (grid, [row, col]) => {
  return dirs
    .all()
    .filter((dir) => matchesPattern(grid, [row, col], dir, "XMAS".split("")))
    .length;
};

const hasShapeOfXmas = (grid, [row, col]) => {
  const pos = Pos(row, col);

  return (
    getGridValue(grid, pos.current) === "A" &&
    dirs.diagonal.filter(
      (dir) =>
        matchesPattern(grid, pos.toIncr(dir).current, dir, ["M"]) &&
        matchesPattern(grid, pos.toIncr(reflection(dir)).current, dir, ["S"])
    ).length === 2
  );
};

const partOne = (data) => {
  let count = 0;
  for (const pos of createGridTraversal(data)) {
    count += countXmasWords(data, pos);
  }
  return count;
};

const partTwo = (data) => {
  let count = 0;
  for (const pos of createGridTraversal(data)) {
    if (hasShapeOfXmas(data, pos)) {
      count++;
    }
  }
  return count;
};

console.log("\x1b[31m--- DATA---\x1b[0m\n", data);
console.log("\x1b[31m--- TEST PART ONE ---\x1b[0m\n", partOne(testOne));
console.log("\x1b[31m--- TEST PART TWO ---\x1b[0m\n", partTwo(testTwo));
console.log();
console.log("\x1b[31m--- PART ONE ---\x1b[0m\n", partOne(data));
console.log("\x1b[31m--- PART TWO ---\x1b[0m\n", partTwo(data));
