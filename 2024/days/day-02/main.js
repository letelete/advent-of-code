const fs = require("fs");

function parse(source) {
  return source
    .split("\n")
    .filter(Boolean)
    .map((line) => [...line.matchAll(/(\d+)/g)])
    .map((matches) => matches.map((match) => Number(match[1])));
}

const data = parse(fs.readFileSync("in.txt", "utf-8"));
const testOne = parse(fs.readFileSync("test.one.txt", "utf-8"));
const testTwo = parse(fs.readFileSync("test.two.txt", "utf-8"));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

const checkAdjacent = (report, ...predicates) => {
  return report.reduce(
    (result, lvl, i, arr) =>
      i === 0 || (result && predicates.every((p) => p(lvl, i, arr))),
    true
  );
};

const checkAdjacentIncreasingBy = (report, min, max) => {
  return checkAdjacent(
    report,
    (lvl, i, arr) => lvl - arr[i - 1] >= min && lvl - arr[i - 1] <= max
  );
};

const partialize = (report) => {
  return new Array(report.length + 1)
    .fill(null)
    .map((_, i) => [...report.slice(0, i), ...report.slice(i + 1)]);
};

const partOne = (data) => {
  return data
    .map(
      (report) =>
        checkAdjacentIncreasingBy(report, 1, 3) ||
        checkAdjacentIncreasingBy(report, -3, -1)
    )
    .filter(Boolean).length;
};

const partTwo = (data) => {
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
};

console.log("\x1b[31m--- DATA---\x1b[0m\n", data);
console.log("\x1b[31m--- TEST PART ONE ---\x1b[0m\n", partOne(testOne));
console.log("\x1b[31m--- TEST PART TWO ---\x1b[0m\n", partTwo(testTwo));
console.log();
console.log("\x1b[31m--- PART ONE ---\x1b[0m\n", partOne(data));
console.log("\x1b[31m--- PART TWO ---\x1b[0m\n", partTwo(data));
