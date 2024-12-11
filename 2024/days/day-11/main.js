function parse(source) {
  return source.trim().split(' ').map(Number);
}

const memo = new Map();

// stone: 0 -> 1
// stone: 1-9 -> stone * 2024 -> [2024-18216] -> [10-99][10-99] [10-99][100-999]
// stone: 10-99 -> [1-9][0-9]
// stone: 100-999 -> stone * 2024 -> [202400-2021976] -> [100-999][1000-9999]
// stone: 1000->9999 -> [10-99][10-99]
// stone: 10000->99999 -> stone * 2024 -> [20240000-202397976] -> [1000-9999][1000-9999] [1000-9999][10000-99999]
// ...
function blink(n, stone) {
  if (!n) {
    return 1;
  }

  const hash = `${n},${stone}`;
  if (memo.has(hash)) {
    return memo.get(hash);
  }

  let result;
  if (!stone) {
    result = blink(n - 1, 1);
  } else if ((len = Math.floor(Math.log10(stone)) + 1) % 2 === 0) {
    const midFactor = 10 ** Math.floor(len / 2);
    result =
      blink(n - 1, Math.floor(stone / midFactor)) +
      blink(n - 1, stone % midFactor);
  } else {
    result = blink(n - 1, stone * 2024);
  }

  memo.set(hash, result);
  return result;
}

function part1(data) {
  return data.reduce((sum, stone) => sum + blink(105, stone), 0);
}

function part2(data) {
  return data.reduce((sum, stone) => sum + blink(75, stone), 0);
}

module.exports = { parse, part1, part2 };
