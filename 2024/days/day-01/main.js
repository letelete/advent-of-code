Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

function parse(source) {
  return source
    .split("\n")
    .filter(Boolean)
    .map((line) => [...line.matchAll(/(\d+)/g)])
    .map((matches) => matches.map((match) => Number(match[1])));
}

const Comp = {
  num: {
    asc: (a, b) => a - b,
  },
};

function part1(data) {
  const left = data.map(([lvalue]) => lvalue).sort(Comp.num.asc);
  const right = data.map(([_, rvalue]) => rvalue).sort(Comp.num.asc);

  const distances = left.map((lvalue, i) => Math.abs(right[i] - lvalue));

  return distances.sum();
}

function part2(data) {
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
}

module.exports = { parse, part1, part2 };
