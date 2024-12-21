const fs = require('fs');

const GCD = (a, b) => {
  return !b ? a : GCD(b, a % b);
};

const LCM = (a, b) => {
  return (a * b) / GCD(a, b);
};

const parse = (source) =>
  source
    .split('\n\n')
    .filter(Boolean)
    .map((e) =>
      e
        .split('\n')
        .filter(Boolean)
        .slice(1)
        .map((e) => e.trim().split(': ')[1])
    )
    .map(([items, operation, test, ifTrue, ifFalse]) => ({
      items: items.split(',').map((e) => Number(e.trim())),
      operation: [
        operation.replace(/[a-zA-Z0-9=\s]/g, ''),
        Number(operation.replace(/\D/g, '')),
      ],
      divisibleBy: Number(test.replace(/[a-zA-Z]/g, '')),
      monkeyTrue: Number(ifTrue.replace(/[a-zA-Z]/g, '')),
      monkeyFalse: Number(ifFalse.replace(/[a-zA-Z]/g, '')),
    }));

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const test = parse(fs.readFileSync('test.txt', 'utf-8'));

const operators = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
};

const withModArithmetic = (a, b, mod, op) => {
  return operators[op](a % mod, b % mod) % mod;
};

const solve = (data) => {
  let counter = new Array(data.length).fill(0);
  const lcm = data.map((e) => e.divisibleBy).reduce(LCM);
  for (let r = 0; r < 10000; ++r) {
    for (let i = 0; i < data.length; ++i) {
      for (let j = 0; j < data[i].items.length; ++j) {
        let worry = data[i].items[j];
        counter[i]++;
        worry = withModArithmetic(
          worry,
          data[i].operation[1] || worry,
          lcm,
          data[i].operation[0]
        );
        if (worry % data[i].divisibleBy === 0) {
          data[data[i].monkeyTrue].items.push(worry);
        } else {
          data[data[i].monkeyFalse].items.push(worry);
        }
      }
      data[i].items.length = 0;
    }
  }
  return counter
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((a, b) => a * b);
};

console.log(solve(data));
