Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.equals = function (arr) {
  return (
    this.length === arr.length && this.every((e, i) => Object.is(e, arr[i]))
  );
};

function parse(source) {
  return {
    rules: [...source.matchAll(/^(\d+)\|(\d+)$/gm)].map((match) =>
      match.slice(1).map(Number)
    ),
    updates: [...source.matchAll(/^\d+(,\d+)*$/gm)].map((match) =>
      match[0].split(",").map(Number)
    ),
  };
}

const compare = (rules) => (a, b) => {
  const rule = rules.find((rule) => rule.includes(a) && rule.includes(b));
  if (!rule) {
    return 0;
  }
  return rule[0] === a ? -1 : 1;
};

function part1(data) {
  const sortCompare = compare(data.rules);
  return data.updates
    .map((update) => update.toSorted(sortCompare))
    .filter((update, index) => update.equals(data.updates[index]))
    .map((update) => update[Math.floor(update.length / 2)])
    .sum();
}

function part2(data) {
  const sortCompare = compare(data.rules);
  return data.updates
    .map((update) => update.toSorted(sortCompare))
    .filter((update, index) => !update.equals(data.updates[index]))
    .map((update) => update[Math.floor(update.length / 2)])
    .sum();
}

module.exports = { parse, part1, part2 };
