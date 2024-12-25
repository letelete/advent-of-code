function parse(source) {
  const [a, b] = source.trim().split('\n\n');

  const codes = [...a.matchAll(/^(\w+):\s(\d)$/gm)].map((groups) => ({
    key: groups[1],
    value: parseInt(groups[2]),
  }));

  const instances = [...b.matchAll(/^([\w\s]+) -> (\w+)$/gm)].map((groups) => ({
    expr: groups[1],
    result: groups[2],
  }));

  return { codes, instances };
}

function evaluate(a, b, op) {
  if (op === 'AND') return a & b;
  if (op === 'OR') return a | b;
  if (op === 'XOR') return a ^ b;
}

function part1(data) {
  const q = [];
  const m = new Map();

  data.codes.forEach(({ key, value }) => m.set(key, value));

  data.instances.forEach((ins) => {
    const [a, op, b] = ins.expr.split(' ');
    if (m.has(a) && m.has(b)) {
      m.set(ins.result, evaluate(m.get(a), m.get(b), op));
    } else {
      q.push(ins);
    }
  });

  while (q.length) {
    const ins = q.shift();
    const [a, op, b] = ins.expr.split(' ');
    if (m.has(a) && m.has(b)) {
      m.set(ins.result, evaluate(m.get(a), m.get(b), op));
    } else {
      q.push(ins);
    }
  }

  const binary = data.instances
    .map(({ result }) => [result, m.get(result)])
    .filter(([e]) => e.startsWith('z'))
    .sort(([a], [b]) => b.localeCompare(a))
    .reduce((binary, [, bit]) => `${binary}${bit}`, '');

  return parseInt(binary, 2);
}

function part2(data) {
  return null;
}

module.exports = { parse, part1, part2 };
