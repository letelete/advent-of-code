function parse(source) {
  return source
    .split("\n")
    .filter(Boolean)
    .map((line) => [...line.matchAll(/(\d+)/g)])
    .map((matches) => matches.map((match) => Number(match[1])));
}

function checkAdjacent(report, ...predicates) {
  return report.reduce(
    (result, lvl, i, arr) =>
      i === 0 || (result && predicates.every((p) => p(lvl, i, arr))),
    true
  );
}

function checkAdjacentIncreasingBy(report, min, max) {
  return checkAdjacent(
    report,
    (lvl, i, arr) => lvl - arr[i - 1] >= min && lvl - arr[i - 1] <= max
  );
}

function partialize(report) {
  return new Array(report.length + 1)
    .fill(null)
    .map((_, i) => [...report.slice(0, i), ...report.slice(i + 1)]);
}

function part1(data) {
  return data
    .map(
      (report) =>
        checkAdjacentIncreasingBy(report, 1, 3) ||
        checkAdjacentIncreasingBy(report, -3, -1)
    )
    .filter(Boolean).length;
}

function part2(data) {
  return data
    .map(partialize)
    .map((partialized) =>
      partialized.some(
        (report) =>
          checkAdjacentIncreasingBy(report, 1, 3) ||
          checkAdjacentIncreasingBy(report, -3, -1)
      )
    )
    .filter(Boolean).length;
}

module.exports = { parse, part1, part2 };
