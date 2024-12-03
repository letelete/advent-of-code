const fs = require("fs");

const parse = (source) =>
  source
    .split("\n")
    .filter(Boolean)
    .map((line) => [...line.matchAll(/(\d+)/g)])
    .map((matches) => matches.map((match) => Number(match[1])));

const data = parse(fs.readFileSync("in.txt", "utf-8"));
const testOne = parse(fs.readFileSync("test.one.txt", "utf-8"));
const testTwo = parse(fs.readFileSync("test.two.txt", "utf-8"));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

const Comp = {
  num: {
    asc: (a, b) => a - b,
  },
};

const partOne = (data) => {
  const left = data.map(([lvalue]) => lvalue).sort(Comp.num.asc);
  const right = data.map(([_, rvalue]) => rvalue).sort(Comp.num.asc);

  const distances = left.map((lvalue, i) => Math.abs(right[i] - lvalue));

  return distances.sum();
};

const partTwo = (data) => {
  const left = data.map(([lvalue]) => lvalue);
  const right = data.map(([_, rvalue]) => rvalue);

  const occurrences = right.reduce((acc, rvalue) => {
    acc.set(rvalue, (acc.get(rvalue) ?? 0) + 1);
    return acc;
  }, new Map());

  const similarityScores = left.map(
    (lvalue) => lvalue * (occurrences.get(lvalue) ?? 0)
  );

  return similarityScores.sum();
};

console.log("\x1b[31m--- DATA---\x1b[0m\n", data);
console.log("\x1b[31m--- TEST PART ONE ---\x1b[0m\n", partOne(testOne));
console.log("\x1b[31m--- TEST PART TWO ---\x1b[0m\n", partTwo(testTwo));
console.log();
console.log("\x1b[31m--- PART ONE ---\x1b[0m\n", partOne(data));
console.log("\x1b[31m--- PART TWO ---\x1b[0m\n", partTwo(data));
