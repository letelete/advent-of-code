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

const memo = new Map();

function findShortestPath(
  [startRow, startCol],
  [endRow, endCol],
  [blockRow, blockCol]
) {
  const hash = [startRow, startCol, endRow, endCol, blockRow, blockCol].join(
    ','
  );
  if (memo.has(hash)) {
    return memo.get(hash);
  }

  const rowDelta = endRow - startRow;
  const colDelta = endCol - startCol;

  const colPath = (colDelta > 0 ? '>' : '<').repeat(Math.abs(colDelta));
  const rowPath = (rowDelta > 0 ? 'v' : '^').repeat(Math.abs(rowDelta));

  const path =
    (endCol > startCol && !arePosEq(endRow, startCol, blockRow, blockCol)) ||
    arePosEq(startRow, endCol, blockRow, blockCol)
      ? `${rowPath}${colPath}`
      : `${colPath}${rowPath}`;

  memo.set(hash, path);
  return path;
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

function findShortestSequence(code, actors) {
  return actors.reduce((val, fn) => fn(val), code);
}

function calculateCodeComplexity(code, actors) {
  const shortestSequence = findShortestSequence(code, actors);
  const numericPart = parseInt(code);
  return shortestSequence.length * numericPart;
}

function part1(data) {
  const actors = [
    processNumericCode,
    processDirectionalInput,
    processDirectionalInput,
  ];
  return data
    .map((code) => calculateCodeComplexity(code, actors))
    .reduce((sum, score) => sum + score, 0);
}

function part2(data) {
  const actors = [
    processNumericCode,
    processDirectionalInput,
    processDirectionalInput,
  ];
  return data.map((code) => findShortestSequence(code, actors));
}

// <AAv<AA>>^A<Av>A^A<vAAA^>AvA^A
// <vA<AA>>^AvAA<^A>Av<<A>>^AvA^Av<<A>>^AA<vA>A^A<A>Av<<A>A^>AAA<Av>A^A
// <vA<AA>>^AvAA<^A>AAv<<A>A^>Av<<A>>^AvAA<^A>AA<vA^>AAv<<A>^A>AvA^A<vA<AA>>^AvAA<^A>Av<<A>A^>AvA^A<A>Av<<A>>^AvA^A<vA<AA>>^AvA^A<Av>A^AAAv<<A>>^A<vA>A^A<A>Av<<A>A^>A<Av>A^Av<<A>>^AvA^A
// v<<A>A^>Av<<A>>^AAvAA<^A>A<vA^>AAv<<A>^A>AvA^AA<vA<AA>>^AvA^A<Av>A^A<vA<AA>>^AvAA<^A>A<vA^>AAv<<A>^A>AvA^AAv<<A>A^>A<Av>A^AA<vA<AA>>^AvA<^A>AvA^A<vA^>A<A>Av<<A>A^>Av<<A>>^AAvAA<^A>A<vA^>AAv<<A>^A>AvA^A<vA<AA>>^AvA^A<Av>A^A<vA^>A<A>Av<<A>>^AvA^A<vA<AA>>^AvAA<^A>A<vA^>A<A>Av<<A>A^>Av<<A>>^AAvAA<^A>A<vA^>A<A>Av<<A>>^A<vA>A^A<A>AAA<vA<AA>>^AvAA<^A>Av<<A>A^>AvA^A<A>Av<<A>>^AvA^A<vA<AA>>^AvA^A<Av>A^Av<<A>>^A<vA>A^A<A>A<vA<AA>>^AvAA<^A>A<vA^>A<A>A

module.exports = { parse, part1, part2 };
