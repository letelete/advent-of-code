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

const createSolver = (ops, memo = new Map()) => {
  const check = (value, nums, test) => {
    if (!nums.length || value > test) {
      return value === test;
    }

    const hash = `${[value, ...nums].join(",")}=${test}`;
    if (!memo.has(hash)) {
      memo.set(
        hash,
        ops.some((op) => check(op(value, nums[0]), nums.slice(1), test))
      );
    }
    return memo.get(hash);
  };

  return { check };
};

function calculateSum(data, solver) {
  return data.reduce((sum, { test, nums }) => {
    if (solver.check(nums[0], nums.slice(1), test)) {
      return sum + test;
    }
    return sum;
  }, 0);
}

const part1Memo = new Map();

function part1(data) {
  const solver = createSolver([ops.add, ops.multiply], part1Memo);
  return calculateSum(data, solver);
}

function part2(data) {
  const part2Memo = new Map(
    [...part1Memo.entries()].filter(([, solved]) => solved)
  );
  const solver = createSolver(Object.values(ops), part2Memo);
  return calculateSum(data, solver);
}

module.exports = { parse, part1, part2 };
