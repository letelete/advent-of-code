const fs = require('fs');

const parseNumbers = (numbers) => {
  return numbers
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((e) => Number(e));
};

const parse = (source) => {
  return source
    .split('\n')
    .filter(Boolean)
    .map((e) => e.split(':'))
    .map(([_, allNumbers]) => allNumbers.split(' | '))
    .map((parts) => parts.map((part) => new Set(parseNumbers(part))))
    .map(([winningNumbers, myNumbers]) => ({
      winningNumbers,
      myNumbers,
    }));
};

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const testOne = parse(fs.readFileSync('test.one.txt', 'utf-8'));
const testTwo = parse(fs.readFileSync('test.two.txt', 'utf-8'));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

const countMatchingNumbers = ({ myNumbers, winningNumbers }) => {
  return [...myNumbers].filter((number) => winningNumbers.has(number)).length;
};

const partOne = (data) => {
  return data
    .map(countMatchingNumbers)
    .filter((matchingCount) => matchingCount > 0)
    .map((matchingCount) => Math.pow(2, matchingCount - 1))
    .sum();
};

const partTwo = (data) => {
  return data
    .map(countMatchingNumbers)
    .reduce((cardCounts, matchingCount, cardIndex) => {
      if (matchingCount <= 0) {
        return cardCounts;
      }

      for (let i = cardIndex + 1; i < cardIndex + 1 + matchingCount; ++i) {
        cardCounts[i] += cardCounts[cardIndex];
      }

      return cardCounts;
    }, new Array(data.length).fill(1))
    .sum();
};

console.log('\x1b[31m--- DATA---\x1b[0m\n', data);
console.log('\x1b[31m--- TEST DATA---\x1b[0m\n', testOne);
console.log('\x1b[31m--- TEST PART ONE ---\x1b[0m\n', partOne(testOne));
console.log('\x1b[31m--- TEST PART TWO ---\x1b[0m\n', partTwo(testTwo));
console.log();
console.log('\x1b[31m--- PART ONE ---\x1b[0m\n', partOne(data));
console.log('\x1b[31m--- PART TWO ---\x1b[0m\n', partTwo(data));
