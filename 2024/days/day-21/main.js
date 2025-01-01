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

function findCharPos(keypad, char) {
  const row = keypad.findIndex((line) => line.includes(char));
  const col = keypad[row].findIndex((cell) => cell === char);
  return [row, col];
}

function arePosEq(aRow, aCol, bRow, bCol) {
  return aRow === bRow && aCol === bCol;
}

function findShortestPath(
  [startRow, startCol],
  [endRow, endCol],
  [blockRow, blockCol]
) {
  const rowDelta = endRow - startRow;
  const colDelta = endCol - startCol;

  const rowPath = new Array(Math.abs(rowDelta)).fill(rowDelta > 0 ? 'v' : '^');
  const colPath = new Array(Math.abs(colDelta)).fill(colDelta > 0 ? '>' : '<');

  const path =
    (endCol > startCol && !arePosEq(endRow, startCol, blockRow, blockCol)) ||
    arePosEq(startRow, endCol, blockRow, blockCol)
      ? [...rowPath, ...colPath]
      : [...colPath, ...rowPath];

  return path.join('');
}

function generateKeypadSequence(keypad, waypoints) {
  if (waypoints.length < 2) {
    throw new Error('Expected at least two waypoints');
  }

  const block = findCharPos(keypad, '.');

  return waypoints.reduce((out, end, i, arr) => {
    if (i === 0) {
      return out;
    }
    const start = arr[i - 1];
    const path = findShortestPath(start, end, block);
    return `${out}${path}A`;
  }, '');
}

function processNumericCode(code) {
  const wp = [...`A${code}`].map((c) => findCharPos(keypad.numeric, c));
  return generateKeypadSequence(keypad.numeric, wp);
}

function processDirectionalInput(input) {
  const wp = [...`A${input}`].map((c) => findCharPos(keypad.directional, c));
  return generateKeypadSequence(keypad.directional, wp);
}

function findShortestSequence(code) {
  const actors = [
    processNumericCode,
    processDirectionalInput,
    processDirectionalInput,
  ];
  return actors.reduce((val, fn) => fn(val), code);
}

function calculateCodeComplexity(code) {
  const shortestSequence = findShortestSequence(code);
  const numericPart = parseInt(code);
  return shortestSequence.length * numericPart;
}

function part1(data) {
  return data
    .map(calculateCodeComplexity)
    .reduce((sum, score) => sum + score, 0);
}

function part2(data) {}

module.exports = { parse, part1, part2 };
