function parse(source) {
  return source.trim().split('\n');
}

const keypad = {
  numeric: [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0', 'A'],
  ],
  directional: [
    ['.', '^', 'A'],
    ['<', 'v', '>'],
  ],
};

function getCharPos(keypad, char) {
  const row = keypad.findIndex((line) => line.includes(char));
  const col = keypad[row].findIndex((cell) => cell === char);
  return [row, col];
}

function arePosEq(aRow, aCol, bRow, bCol) {
  return aRow === bRow && aCol === bCol;
}

const shortestPathMemo = new Map();

function getShortestPath(
  [startRow, startCol],
  [endRow, endCol],
  [blockRow, blockCol]
) {
  const hash = [startRow, startCol, endRow, endCol, blockRow, blockCol].join(
    ','
  );
  if (shortestPathMemo.has(hash)) {
    return shortestPathMemo.get(hash);
  }

  const rowDelta = endRow - startRow;
  const colDelta = endCol - startCol;

  const colPath = (colDelta > 0 ? '>' : '<').repeat(Math.abs(colDelta));
  const rowPath = (rowDelta > 0 ? 'v' : '^').repeat(Math.abs(rowDelta));

  const isVerticalFirst =
    (endCol > startCol && !arePosEq(endRow, startCol, blockRow, blockCol)) ||
    arePosEq(startRow, endCol, blockRow, blockCol);

  const path = isVerticalFirst
    ? `${rowPath}${colPath}`
    : `${colPath}${rowPath}`;

  shortestPathMemo.set(hash, path);
  return path;
}

function getKeypadSequence(keypad, waypoints) {
  if (waypoints.length < 2) {
    throw new Error('Expected at least two waypoints');
  }

  const block = getCharPos(keypad, '.');

  return waypoints.reduce((out, end, i, arr) => {
    if (i === 0) {
      return out;
    }
    const start = arr[i - 1];
    const path = getShortestPath(start, end, block);
    return `${out}${path}A`;
  }, '');
}

function processNumericCode(code) {
  const wp = [...`A${code}`].map((c) => getCharPos(keypad.numeric, c));
  return getKeypadSequence(keypad.numeric, wp);
}

function processDirectionalInput(input) {
  const wp = [...`A${input}`].map((c) => getCharPos(keypad.directional, c));
  return getKeypadSequence(keypad.directional, wp);
}

function findShortestSequenceLength(input, actors) {
  if (actors < 1) {
    return input.length;
  }

  const partialize = (input) =>
    input
      .split('A')
      .slice(0, -1)
      .map((substr) => `${substr}A`)
      .reduce((counter, substr) => {
        counter.set(substr, (counter.get(substr) ?? 0) + 1);
        return counter;
      }, new Map());

  let counter = partialize(processDirectionalInput(input));

  while (--actors) {
    counter = counter.entries().reduce((temp, [substr, count]) => {
      partialize(processDirectionalInput(substr))
        .entries()
        .forEach(([_substr, _count]) => {
          temp.set(_substr, (temp.get(_substr) ?? 0) + count * _count);
        });
      return temp;
    }, new Map());
  }

  return counter
    .entries()
    .reduce((sum, [key, val]) => sum + key.length * val, 0);
}

function calculateCodeComplexity(code, actors) {
  return (
    findShortestSequenceLength(processNumericCode(code), actors - 1) *
    parseInt(code)
  );
}

function calculateTotalComplexity(data, actors) {
  return data
    .map((code) => calculateCodeComplexity(code, actors))
    .reduce((sum, score) => sum + score, 0);
}

function part1(data) {
  return calculateTotalComplexity(data, 3);
}

function part2(data) {
  return calculateTotalComplexity(data, 26);
}

module.exports = { parse, part1, part2 };
