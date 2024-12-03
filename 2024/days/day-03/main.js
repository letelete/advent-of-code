const fs = require("fs");

const parse = (source) =>
  [...source.matchAll(/(mul\(\d+,\d+\))|(don't\(\))|(do\(\))/g)]
    .map((matches) => matches[0])
    .map((instr) =>
      instr.startsWith("mul")
        ? [...instr.matchAll(/(\d+)/g)].map((m) => Number(m[0]))
        : instr
    );

const data = parse(fs.readFileSync("in.txt", "utf-8"));
const testOne = parse(fs.readFileSync("test.one.txt", "utf-8"));
const testTwo = parse(fs.readFileSync("test.two.txt", "utf-8"));

Array.prototype.sum = function () {
  return this.reduce((sum, val) => sum + val, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, val) => x * val, 1);
};

const partOne = (data) => {
  return data
    .filter((e) => Array.isArray(e))
    .map((e) => e.product())
    .sum();
};

const partTwo = (data) => {
  return data.reduce(
    ({ include, result }, instruction) =>
      [
        {
          test: () => instruction === "don't()",
          op: () => ({ include: false, result }),
        },
        {
          test: () => instruction === "do()",
          op: () => ({ include: true, result }),
        },
        {
          test: () => Array.isArray(instruction) && include,
          op: () => ({ include, result: result + instruction.product() }),
        },
      ]
        .find(({ test }) => test())
        ?.op() ?? { include, result },
    { include: true, result: 0 }
  ).result;
};

console.log("\x1b[31m--- DATA---\x1b[0m\n", data);
console.log("\x1b[31m--- TEST PART ONE ---\x1b[0m\n", partOne(testOne));
console.log("\x1b[31m--- TEST PART TWO ---\x1b[0m\n", partTwo(testTwo));
console.log();
console.log("\x1b[31m--- PART ONE ---\x1b[0m\n", partOne(data));
console.log("\x1b[31m--- PART TWO ---\x1b[0m\n", partTwo(data));
