function parse(source) {
  return source.trim().split('\n').map(Number);
}

const N = 2000;

function gen(seed) {
  const offset = 16777215;
  seed ^= (seed << 6) & offset;
  seed ^= (seed >> 5) & offset;
  seed ^= (seed << 11) & offset;
  return seed;
}

function genNth(seed, n) {
  while (n--) {
    seed = gen(seed);
  }
  return seed;
}

const next = (seed) => {
  const newSeed = gen(seed);
  return {
    seed: newSeed,
    price: newSeed % 10,
    change: (newSeed % 10) - (seed % 10),
  };
};

function genSequences(seed, N) {
  const m = new Map();

  const window = new Array(4).fill(null);
  for (let i = 0; i < window.length; ++i) {
    window[i] = next(window[i - 1]?.seed ?? seed);
  }

  for (let i = 4; i < N - 1; ++i) {
    const hash = window.map(({ change }) => change).join(',');
    const prev = window.at(-1);
    m.set(hash, Math.max(m.get(hash) ?? 0, prev.price));
    window.push(next(prev.seed));
    window.shift();
  }

  return m;
}

function getMaxBananas(seeds, N) {
  const m = new Map();
  let max = 0;
  seeds.forEach((seed) =>
    genSequences(seed, N)
      .entries()
      .forEach(([hash, value]) => {
        const sum = (m.get(hash) ?? 0) + value;
        max = Math.max(sum, max);
        m.set(hash, sum);
      })
  );
  return max;
}

function part1(data) {
  return Number(data.reduce((sum, seed) => sum + genNth(seed, N), 0));
}

function part2(data) {
  return getMaxBananas(data, N);
}

module.exports = { parse, part1, part2 };
