function parse(source) {
  return source.trim().split("\n");
}

const symbols = { obstacle: "#", guard: "^", empty: "." };
const dirs = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

function getGuardPos(data) {
  const row = data.findIndex((row) => row.includes(symbols.guard));
  const col = data[row].split("").findIndex((col) => col === symbols.guard);

  return [row, col];
}

function isInRange(data, row, col) {
  return row >= 0 && row < data.length && col >= 0 && col < data[0].length;
}

function createWalker(
  [initialRow, initialCol],
  initialDir,
  getValue,
  checkInRange
) {
  const visitedWithDir = new Set();
  let row = initialRow;
  let col = initialCol;
  let dir = initialDir;

  const encodeHash = (row, col, dir) => `${row},${col},${dir}`;
  const decodeHash = (hash) => hash.split(",").map(Number);
  const nextRow = (row, dir) => row + dirs[dir][0];
  const nextCol = (col, dir) => col + dirs[dir][1];
  const nextDir = (dir) => (dir + 1) % dirs.length;

  const buildWalkerResponse = ({ escaped }) => ({
    row,
    col,
    dir,
    escaped,
  });

  function* stepGenerator() {
    while (checkInRange(row, col)) {
      const hash = encodeHash(row, col, dir);
      if (visitedWithDir.has(hash)) {
        return buildWalkerResponse({ escaped: false });
      }
      visitedWithDir.add(hash);

      yield buildWalkerResponse({ escaped: false });

      let rotations = dirs.length;
      while (
        --rotations &&
        checkInRange(nextRow(row, dir), nextCol(col, dir)) &&
        getValue(nextRow(row, dir), nextCol(col, dir)) === symbols.obstacle
      ) {
        dir = nextDir(dir);
      }
      if (rotations <= 0) {
        return buildWalkerResponse({ escaped: false });
      }

      row = nextRow(row, dir);
      col = nextCol(col, dir);
    }

    return buildWalkerResponse({ escaped: true });
  }

  return {
    initialPos: [initialRow, initialCol],
    initialDir,
    gen: stepGenerator(),
    step: null,
    walk() {
      this.step = this.gen.next();
      while (!this.step.done) {
        this.step = this.gen.next();
      }
      return this;
    },
    get visited() {
      return new Set(
        [...visitedWithDir].map((hash) => {
          const [row, col] = decodeHash(hash);
          return encodeHash(row, col);
        })
      );
    },
    encodeHash,
    decodeHash,
  };
}

function part1(data) {
  const walker = createWalker(
    getGuardPos(data),
    1,
    (row, col) => data[row][col],
    (row, col) => isInRange(data, row, col)
  ).walk();

  if (!walker.step.value.escaped) {
    throw new Error("Guard cannot escape the lab");
  }

  return walker.visited.size;
}

function part2(data) {
  const walker = createWalker(
    getGuardPos(data),
    1,
    (row, col) => data[row][col],
    (row, col) => isInRange(data, row, col)
  ).walk();

  if (!walker.step.value.escaped) {
    throw new Error("Guard cannot escape the lab");
  }

  let cycles = 0;
  walker.visited.forEach((posHash) => {
    const [obstacleRow, obstacleCol] = walker.decodeHash(posHash);
    const walkerWithObstacle = createWalker(
      walker.initialPos,
      1,
      (row, col) =>
        data[row][col] === symbols.empty &&
        row === obstacleRow &&
        col === obstacleCol
          ? symbols.obstacle
          : data[row][col],
      (row, col) => isInRange(data, row, col)
    );

    if (!walkerWithObstacle.walk().step.value.escaped) {
      cycles++;
    }
  });
  return cycles;
}

module.exports = { parse, part1, part2 };
