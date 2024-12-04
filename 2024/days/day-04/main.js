const fs = require("fs");

const parse = (source) => source.split("\n").filter(Boolean);

const data = parse(fs.readFileSync("in.txt", "utf-8"));
const testOne = parse(fs.readFileSync("test.one.txt", "utf-8"));
const testTwo = parse(fs.readFileSync("test.two.txt", "utf-8"));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

function* createGridTraversal(grid, [initialRow, initialCol] = [0, 0]) {
  for (let row = initialRow; row < grid.length; ++row) {
    for (let col = initialCol; col < grid[row].length; ++col) {
      yield [row, col];
    }
  }
}

const dirsLTRB = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

const dirsLTRBDiag = [
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
];

const allDirs = [...dirsLTRB, ...dirsLTRBDiag];

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

function reflection([x, y]) {
  return [x * -1, y * -1];
}

function getGridValue(grid, [row, col]) {
  return grid[row][col];
}

function checkForPatternInDir(grid, [row, col], [dirRow, dirCol], patternQ) {
  const pos = Pos(row, col);

  while (
    patternQ.length &&
    pos.inRange(0, grid.length - 1, 0, grid[0].length - 1)
  ) {
    if (getGridValue(grid, pos.current) === patternQ[0]) {
      patternQ.shift();
    } else {
      break;
    }

    pos.incr([dirRow, dirCol]);
  }

  return patternQ.length === 0;
}

const countXmasWords = (grid, [row, col]) => {
  let count = 0;

  for (const dir of allDirs) {
    if (checkForPatternInDir(grid, [row, col], dir, "XMAS".split(""))) {
      count++;
    }
  }

  return count;
};

const hasShapeOfXmas = (grid, [row, col]) => {
  const pos = Pos(row, col);

  if (getGridValue(grid, pos.current) !== "A") {
    return false;
  }

  let count = 0;
  for (const dir of dirsLTRBDiag) {
    if (
      checkForPatternInDir(grid, pos.toIncr(dir).current, dir, ["M"]) &&
      checkForPatternInDir(grid, pos.toIncr(reflection(dir)).current, dir, [
        "S",
      ])
    ) {
      count++;
    }
  }

  return count === 2;
};

const partOne = (data) => {
  const dataTraversal = createGridTraversal(data);
  let count = 0;

  for (const pos of dataTraversal) {
    count += countXmasWords(data, pos);
  }

  return count;
};

const partTwo = (data) => {
  const dataTraversal = createGridTraversal(data);
  let count = 0;

  for (const pos of dataTraversal) {
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
