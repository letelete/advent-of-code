const fs = require("fs");

const parse = (source) => ({
  rules: [...source.matchAll(/^(\d+)\|(\d+)$/gm)].map((match) =>
    match.slice(1).map(Number)
  ),
  updates: [...source.matchAll(/^\d+(,\d+)*$/gm)].map((match) =>
    match[0].split(",").map(Number)
  ),
});

const data = parse(fs.readFileSync("in.txt", "utf-8"));
const testOne = parse(fs.readFileSync("test.one.txt", "utf-8"));
const testTwo = parse(fs.readFileSync("test.two.txt", "utf-8"));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

Array.prototype.equals = function (arr) {
  return this.every((e, i) => e === arr[i]);
};

const compare = (rules) => (a, b) => {
  const rule = rules.find((rule) => rule.includes(a) && rule.includes(b));
  if (!rule) {
    return 0;
  }
  if (rule[0] === a) {
    return -1;
  }
  return 1;
};

const partOne = (data) => {
  return data.updates
    .map((update) => update.toSorted(compare(data.rules)))
    .filter((update, index) => update.equals(data.updates[index]))
    .map((update) => update[Math.floor(update.length / 2)])
    .sum();
};

const partTwo = (data) => {
  return data.updates
    .map((update) => update.toSorted(compare(data.rules)))
    .filter((update, index) => !update.equals(data.updates[index]))
    .map((update) => update[Math.floor(update.length / 2)])
    .sum();
};

console.log("\x1b[31m--- DATA---\x1b[0m\n", data);
console.log("\x1b[31m--- TEST PART ONE ---\x1b[0m\n", partOne(testOne));
console.log("\x1b[31m--- TEST PART TWO ---\x1b[0m\n", partTwo(testTwo));
console.log();
console.log("\x1b[31m--- PART ONE ---\x1b[0m\n", partOne(data));
console.log("\x1b[31m--- PART TWO ---\x1b[0m\n", partTwo(data));
