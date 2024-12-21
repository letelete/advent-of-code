const fs = require('fs');

const inputs = fs
  .readFileSync('in.txt', 'utf-8')
  .replace(/[\[\]]/gm, '')
  .split('\n\n')
  .filter(Boolean);

const stacksInput = inputs[0].split('\n');
const instructionsInput = inputs[1];

const stacksLength = Number(stacksInput.slice(-1)[0].slice(-1)[0]);
const stacks = new Array(stacksLength).fill([]);

// for (let j = 0; j < stacksInput[0].length; j += 2) {
//   for (let i = 0; i < stacksLength; ++i) {
//     const value = stacksInput[i][j];
//     // stacks[i].push(value);
//     console.log(value);
//   }
// }

// console.log(stacks);

// // const stacks = stacksInput.split('\n').reverse().slice(1);
// //   .map((x) => x.split(' '))
// //   .reduce((s, x) => {
// //     x.forEach((e, i) => e && (s[i] ? s[i].push(e) : (s[i] = [])));
// //     return s;
// //   }, []);
// console.log(stacks);
// const instructions = instructionsInput
//   .split('\n')
//   .filter(Boolean)
//   .map((line) => line.split(' '))
//   .map(([move, from, to]) => ({ move, from, to }))
//   .map(({ from, to, ...rest }) => ({ ...rest, from: from - 1, to: to - 1 }));

// (() => {
//   s = [...stacks.map((e) => e)];
//   instructions.forEach(({ move, from, to }) => {
//     s[to] = [...s[from].slice(s[from].length - move), ...s[to]];
//     s[from] = s[from].slice(move);
//   });
//   console.log(s.map((e) => e[0]).join(''));
// })();
