const fs = require('fs');

const input = fs
  .readFileSync('in.txt', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((round) => round.split(' '))
  .map((moves) => moves.map((m) => 'ABCXYZ'.indexOf(m) % 3));

const moveToLoseDrawWinState = [[2, 0, 1], [0, 1, 2], [1, 2, 0]];
const stateScores = [0, 3, 6];

const scoreForRound = ([a, b]) => stateScores[moveToLoseDrawWinState[a].indexOf(b)] + b + 1;
const deduceMoves = ([a, b]) => [a, moveToLoseDrawWinState[a][b]];
const sum = (a, b) => a + b;

console.log(input.map(scoreForRound).reduce(sum));
console.log(input.map(deduceMoves).map(scoreForRound).reduce(sum));
