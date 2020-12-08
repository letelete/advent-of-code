const fs = require('fs');
const path = require('path');

const day5 = (input) => {
  const groups = input.split(/\n\n/).map((group) => group.split(/[\s\n]/));

  const part1 = () => {
    return groups.reduce(
      (sum, group) =>
        sum + new Set(group.reduce((arr, vote) => [...arr, ...vote])).size,
      0
    );
  };

  const part2 = () => {
    return groups.reduce(
      (sum, group) =>
        sum +
        group.reduce((intersected, vote) => {
          const uniqueAnswers = new Set([...vote]);
          return intersected
            ? intersected.filter((e) => uniqueAnswers.has(e))
            : [...uniqueAnswers];
        }, null).length,
      0
    );
  };

  return { part1, part2 };
};

const input = fs.readFileSync(path.resolve(__dirname, 'input'), 'utf-8');
Object.values(day5(input)).forEach((solution, index) =>
  console.log(`Part ${index + 1}`, solution())
);
