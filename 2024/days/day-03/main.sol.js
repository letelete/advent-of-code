Array.prototype.sum = function () {
  return this.reduce((sum, val) => sum + val, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, val) => x * val, 1);
};

function parse(source) {
  return [...source.matchAll(/(mul\(\d+,\d+\))|(don't\(\))|(do\(\))/g)]
    .map((matches) => matches[0])
    .map((instr) =>
      instr.startsWith("mul")
        ? [...instr.matchAll(/(\d+)/g)].map((m) => Number(m[0]))
        : instr
    );
}

function part1(data) {
  return data
    .filter((e) => Array.isArray(e))
    .map((e) => e.product())
    .sum();
}

function part2(data) {
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
}

module.exports = { parse, part1, part2 };
