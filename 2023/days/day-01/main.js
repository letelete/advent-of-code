const fs = require("fs");

const parse = (source) => source.split("\n").filter(Boolean);

const data = parse(fs.readFileSync("in.txt", "utf-8"));
const testOne = parse(fs.readFileSync("test.one.txt", "utf-8"));
const testTwo = parse(fs.readFileSync("test.two.txt", "utf-8"));

Array.prototype.sum = function() {
  return this.reduce((sum, value) => sum + value, 0);
}

const partOne = (data) => {
  const re = /\d/g
  return data
    .map((e) => e.match(re))
    .map((e) => Number(e[0] + e[e.length - 1]))
    .sum()
};

const partTwo = (data) => {
  const digits = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"].reduce((o, x, i) => ({ ...o, [x]: i + 1 }), {});
  
  const matchOverlaps = (x) => {
    const re = /((?=(one|two|three|four|five|six|seven|eight|nine))|\d)/g
    return [...x.matchAll(re)].map(([_, number, digit]) => Number(digits?.[digit] ?? number))
  }
  
  return data
      .map(matchOverlaps)
      .map((e) => e[0] * 10 + e[e.length - 1])
      .sum()
};

console.log("\x1b[31m--- DATA---\x1b[0m\n", data);
console.log("\x1b[31m--- TEST PART ONE ---\x1b[0m\n", partOne(testOne));
console.log("\x1b[31m--- TEST PART TWO ---\x1b[0m\n", partTwo(testTwo));
console.log()
console.log("\x1b[31m--- PART ONE ---\x1b[0m\n", partOne(data));
console.log("\x1b[31m--- PART TWO ---\x1b[0m\n", partTwo(data));
