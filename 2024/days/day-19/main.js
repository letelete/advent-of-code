function parse(source) {
  const [patterns, designs] = source
    .trim()
    .split('\n\n')
    .map((e) => e.match(/(\w+)/g));

  return { patterns, designs };
}

function createPatternsCounter(patterns) {
  const memo = new Map();

  return (design) => {
    const count = (str) => {
      if (!str.length) {
        return 1;
      }

      if (memo.has(str)) {
        return memo.get(str);
      }

      let localCount = 0;
      for (const pattern of patterns) {
        if (str.startsWith(pattern)) {
          const substr = str.slice(pattern.length);
          localCount += count(substr);
        }
      }

      memo.set(str, localCount);

      return localCount;
    };

    return count(design);
  };
}

function part1(data) {
  const countWaysToCreateDesign = createPatternsCounter(data.patterns);
  return data.designs.filter(countWaysToCreateDesign).length;
}

function part2(data) {
  const countWaysToCreateDesign = createPatternsCounter(data.patterns);
  return data.designs
    .map(countWaysToCreateDesign)
    .reduce((sum, e) => sum + e, 0);
}

module.exports = { parse, part1, part2 };
