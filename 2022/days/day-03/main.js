const fs = require('fs');

const input = fs.readFileSync('in.txt', 'utf-8').split('\n').filter(Boolean);

const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const intersect = (arrs) => {
  const sets = arrs.map((arr) => new Set(arr));
  return [...sets[0]].filter((x) => sets.slice(1).every((set) => set.has(x)));
};

const charactersScore = (characters) =>
  characters
    .map((ch) => ch.map((ch) => [...alpha].indexOf(ch) + 1))
    .flat();

const part1 = input
  .map((line) => [line.slice(0, line.length / 2), line.slice(line.length / 2)])
  .map((parts) => parts.map((p) => [...p]))
  .map(intersect)
  .map(charactersScore)
  .reduce((a, b) => a + b, 0);

const part2 = input
  .join(' ')
  .match(/((.+?)(\s|$)){1,3}/g)
  .map((seg) => seg.trim().split(' '))
  .map((seg) => seg.map((s) => [...s]))
  .map(intersect)
  .map(charactersScore)
  .reduce((a, b) => a + b, 0);

console.log(part1);
console.log(part2);
