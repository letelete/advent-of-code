const fs = require('fs');

const parse = (source) => {
  const [instruction, network] = source.trim().split('\n\n').filter(Boolean);
  return {
    instruction: instruction
      .replaceAll('R', 1)
      .replaceAll('L', 0)
      .split('')
      .map(Number),
    network: network
      .split('\n')
      .map((row) => row.split(' = '))
      .reduce((map, [node, routes]) => {
        map.set(node, routes.replaceAll(/\(|\)/gi, '').split(', '));
        return map;
      }, new Map()),
  };
};

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const testOne = parse(fs.readFileSync('test.one.txt', 'utf-8'));
const testTwo = parse(fs.readFileSync('test.two.txt', 'utf-8'));

const gcd = (a, b) => {
  while (b !== 0) {
    a %= b;
    if (a === 0) return b;
    b %= a;
  }
  return a;
};

const lcm = (a, b) => (a * b) / gcd(a, b);

function* traverseNetwork(instruction, network, root) {
  let distance = 0;

  while (true) {
    const instr = instruction[distance % instruction.length];
    root = network.get(root)[instr];
    distance++;

    yield { distance, root };
  }
}

const partOne = (data) => {
  const traverse = traverseNetwork(data.instruction, data.network, 'AAA');

  let step;
  while ((step = traverse.next().value).root != 'ZZZ') {}

  return step.distance;
};

const partTwo = (data) => {
  const roots = [...data.network.keys()].filter((e) => e.match(/A$/));

  const stepsToCycle = (root) => {
    const traverse = traverseNetwork(data.instruction, data.network, root);

    let step;
    while (!(step = traverse.next().value).root.match(/Z$/)) {}

    return step.distance;
  };

  return roots
    .map(stepsToCycle)
    .reduce((localLcm, steps) => lcm(localLcm, steps));
};

console.log('\x1b[31m--- DATA---\x1b[0m\n', data);
console.log('\x1b[31m--- TEST PART ONE ---\x1b[0m\n', partOne(testOne));
console.log('\x1b[31m--- TEST PART TWO ---\x1b[0m\n', partTwo(testTwo));
console.log();
console.log('\x1b[31m--- PART ONE ---\x1b[0m\n', partOne(data));
console.log('\x1b[31m--- PART TWO ---\x1b[0m\n', partTwo(data));
