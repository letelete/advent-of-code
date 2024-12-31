function parse(source) {
  return source.trim().split('\n');
}

const dirs = {
  orthogonal: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
};

function toDirectional(dirIndex) {
  return ['<', '^', '>', 'v'][dirIndex];
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

function hash(arr) {
  return arr.join(',');
}

function findCharPos(keypad, char) {
  const row = keypad.findIndex((line) => line.includes(char));
  const col = keypad[row].findIndex((cell) => cell === char);
  return [row, col];
}

function findShortestPath(keypad, start, [endRow, endCol]) {
  const q = [[0, start, []]];
  const visited = new Set();

  while (q.length) {
    q.sort(([adist], [bdist]) => bdist - adist);
    const [dist, [row, col], path] = q.pop();

    visited.add(hash([row, col]));

    if (row === endRow && col === endCol) {
      return path;
    }

    dirs.orthogonal.forEach(([drow, dcol], di) => {
      const [nextRow, nextCol] = [row + drow, col + dcol];
      if (
        keypad[nextRow]?.[nextCol] !== undefined &&
        keypad[nextRow][nextCol] !== '.' &&
        !visited.has(hash([nextRow, nextCol]))
      ) {
        q.push([dist + 1, [nextRow, nextCol], [...path, di]]);
      }
    });
  }

  return null;
}

function processWaypoints(keypad, waypoints) {
  if (waypoints.length < 2) {
    throw new Error('Expected at least two waypoints');
  }
  return waypoints.slice(1).reduce((out, end, i) => {
    if (i === 0) {
      return out;
    }
    const start = waypoints[i - 1];
    const path = findShortestPath(keypad, start, end)
      .map(toDirectional)
      .join('');
    return `${out}${path}A`;
  }, '');
}

function processNumericCode(code) {
  const wp = [...`A${code}`].map((c) => findCharPos(keypad.numeric, c));
  return processWaypoints(keypad.numeric, wp);
}

function processDirectionalInput(input) {
  const wp = [...`A${input}`].map((c) => findCharPos(keypad.directional, c));
  return processWaypoints(keypad.directional, wp);
}

function findShortestSequence(code) {
  const actors = [
    // robot 1 instruction
    processNumericCode,
    // robot 2 instruction
    processDirectionalInput,
    // robot 3 instruction
    processDirectionalInput,
  ];
  return actors.reduce((val, fn) => fn(val), code);
}

function calculateCodeComplexity(code) {
  const shortestSequence = findShortestSequence(code);
  const numericPart = parseInt(code);
  console.log(
    `${code} (${numericPart}):`,
    `${shortestSequence} (${shortestSequence.length})`
  );
  return shortestSequence.length * numericPart;
}

function logTest(ok, ...args) {
  const colors = {
    fggreen: '\x1b[32m',
    fgred: '\x1b[31m',
    reset: '\x1b[0m',
  };
  console.log(
    ok
      ? `${colors.fggreen}[ok]${colors.reset}`
      : `${colors.fgred}[x]${colors.reset}`,
    ...args
  );
}

function logExpect(ok, actual, expected) {
  logTest(ok, 'expected:', expected, 'got:', actual);
}

function expect(actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  logExpect(ok, actual, expected);
}

function compareMaps(map1, map2) {
  let testVal;
  if (map1.size !== map2.size) {
    return false;
  }
  for (let [key, val] of map1) {
    testVal = map2.get(key);
    // in cases of an undefined value, make sure the key
    // actually exists on the object so there are no false positives
    if (testVal !== val || (testVal === undefined && !map2.has(key))) {
      return false;
    }
  }
  return true;
}

function testSequence(actual, expected) {
  const count = (seq) => {
    const segments = [new Map()];
    [...seq].forEach((char, i) => {
      if (char === 'A' && i !== seq.length - 1) {
        segments.push(new Map());
      } else {
        segments.at(-1).set(char, (segments.at(-1).get(char) ?? 0) + 1);
      }
    });
    return segments;
  };

  const verify = (actual, expected) => {
    const seg1 = count(actual);
    const seg2 = count(expected);
    logTest(
      seg1.length === seg2.length,
      'seg1 length',
      seg1.length,
      '===',
      'seg2 length',
      seg2.length
    );
    let l1 = 0;
    let l2 = 0;
    while (seg1.length) {
      const head1 = seg1.shift();
      const head2 = seg2.shift();
      const r1 = l1 + [...head1.values()].reduce((sum, e) => sum + e, 0);
      const r2 = l2 + [...head2.values()].reduce((sum, e) => sum + e, 0);
      const highlight = (str, l, r) => {
        return (
          [...str]
            .map((e, i) =>
              i >= l && i <= r ? `\x1b[45m\x1b[37m${e}\x1b[0m` : e
            )
            .join('') + ``
        );
      };
      const ok = compareMaps(head1, head2);
      logTest(
        ok,
        '\n',
        highlight(actual, l1, r1),
        '(actual)\n',
        highlight(expected, l2, r2),
        '(expected)'
      );
      if (!ok) {
        break;
      }
      l1 = r1 + 1;
      l2 = r2 + 1;
    }
  };

  console.log('\n\n[test sequence]', { actual, expected });
  verify(actual, expected);
}

function test029A() {
  const code = '029A';
  const out1 = '<A^A>^^AvvvA';
  const out2 = 'v<<A>>^A<A>AvA<^AA>A<vAAA>^A';
  const out3 =
    '<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A';
  const out1_actual = processNumericCode(code);
  const out2_actual = processDirectionalInput(out1_actual);
  const out3_actual = processDirectionalInput(out2_actual);

  console.log('\nout1_actual');
  testSequence(out1_actual, out1);
  expect(out1_actual.length, out1.length);
  console.log('\nout2_actual');
  testSequence(out2_actual, out2);
  expect(out2_actual.length, out2.length);
  console.log('\nout3_actual');
  testSequence(out3_actual, out3);
  testSequence(out3_actual, out3);
  expect(out3_actual.length, out3.length);

  console.log('\ntest find shortest sequence');
  const shortestseq = findShortestSequence(code);
  testSequence(shortestseq, out3);
  expect(shortestseq.length, out3.length);
}

// [
//   [
//     '029A',
//     '<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A',
//     68 * 29,
//   ],
//   [
//     '980A',
//     '<v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A',
//     60 * 980,
//   ],
//   [
//     '179A',
//     '<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A',
//     68 * 179,
//   ],
//   [
//     '456A',
//     '<v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A',
//     64 * 456,
//   ],
//   [
//     '379A',
//     '<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A',
//     64 * 379,
//   ],
// ].forEach(([code, sequence, complexity]) => {
//   console.log('[Test]', code);
//   const seq = findShortestSequence(code);
//   testSequence(seq, sequence);
//   expect(seq.length, sequence.length);
//   expect(calculateCodeComplexity(code), complexity);
//   console.log('---\n');
// });

test029A();

function part1(data) {
  // return data
  //   .map(calculateCodeComplexity)
  //   .reduce((sum, score) => sum + score, 0);
}

function part2(data) {
  // return null;
}

module.exports = { parse, part1, part2 };
