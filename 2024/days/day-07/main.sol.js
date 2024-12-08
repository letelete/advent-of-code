const fs = require("fs");

function parse(source) {
  return [...source.trim().matchAll(/^(\d+):\s((?:\d+\s?)+)$/gm)].map(
    ([_, test, nums]) => ({
      test: Number(test),
      nums: nums.split(" ").map(Number),
    })
  );
}

const ops = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
  concat: (a, b) => Number(`${a}${b}`),
};

const createSolver = (ops) => {
  const memo = new Map();

  const check = (value, nums, test) => {
    if (!nums.length) {
      return value === test;
    }

    const hash = `${[value, ...nums].join(",")}=${test}`;

    if (!memo.has(hash)) {
      const result = ops.some((op) =>
        check(op(value, nums[0]), nums.slice(1), test)
      );
      memo.set(hash, result);
    }

    return memo.get(hash);
  };

  return { check };
};

function calculateSum(data, ops) {
  const solver = createSolver(ops);

  return data.reduce((sum, { test, nums }) => {
    if (solver.check(nums[0], nums.slice(1), test)) {
      return sum + test;
    }
    return sum;
  }, 0);
}

function part1(data) {
  return calculateSum(data, [ops.add, ops.multiply]);
}

function part2(data) {
  return calculateSum(data, Object.values(ops));
}

module.exports = { parse, part1, part2 };
