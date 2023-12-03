const fs = require('fs');

const parse = (source) =>
  source
    .split('\n')
    .filter(Boolean)
    .map((e) => e.split(''));

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const testOne = parse(fs.readFileSync('test.one.txt', 'utf-8'));
const testTwo = parse(fs.readFileSync('test.two.txt', 'utf-8'));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const parseNumbers = (data) => {
  const numbers = data.reduce((numbers, row, i) => {
    let numberBuffer = [];
    let isAdjacentToSymbol = false;

    row.forEach((char, j) => {
      const isNumber = !isNaN(char);
      const isEndOfRow = j === row.length - 1;

      const checkIfAdjacentToSymbol = () => {
        return dirs.some(([di, dj]) => {
          const dChar = data?.[i + di]?.[j + dj];
          return dChar && dChar !== '.' && isNaN(dChar);
        });
      };

      const readNumberFromBuffer = () => {
        const number = Number(numberBuffer.join(''));
        const isNumberAtEndOfRow = isEndOfRow && isNumber;

        return {
          from: [i, j - numberBuffer.length + (isNumberAtEndOfRow ? 1 : 0)],
          to: [i, j - (isNumberAtEndOfRow ? 0 : 1)],
          collides(xi, xj) {
            return (
              xi >= this.from[0] &&
              xj >= this.from[1] &&
              xi <= this.to[0] &&
              xj <= this.to[1]
            );
          },
          number,
          isAdjacentToSymbol,
        };
      };

      if (isNumber) {
        numberBuffer.push(char);
        if (!isAdjacentToSymbol) {
          isAdjacentToSymbol = checkIfAdjacentToSymbol();
        }
      }

      if (!isNumber || isEndOfRow) {
        if (numberBuffer.length) {
          numbers.push(readNumberFromBuffer());
        }

        numberBuffer = [];
        isAdjacentToSymbol = false;
      }
    });

    return numbers;
  }, []);

  return numbers;
};

const partOne = (data) => {
  return parseNumbers(data)
    .filter(({ isAdjacentToSymbol }) => isAdjacentToSymbol)
    .map(({ number }) => number)
    .sum();
};

const partTwo = (data) => {
  const numbers = parseNumbers(data).filter(
    ({ isAdjacentToSymbol }) => isAdjacentToSymbol
  );

  const gearIndexes = data.reduce((indexes, row, i) => {
    let j = -1;
    while ((j = row.indexOf('*', j + 1)) !== -1) {
      indexes.push([i, j]);
    }

    return indexes;
  }, []);

  const getPartNumbersAt = ([i, j]) => {
    const partNumbers = dirs
      .map(([di, dj]) => [i + di, j + dj])
      .reduce((numbersFound, [xi, xj]) => {
        const num = numbers.find((num) => num.collides(xi, xj));
        if (!num) {
          return numbersFound;
        }
        if (numbersFound.findIndex((data) => data.collides(xi, xj)) !== -1) {
          return numbersFound;
        }

        numbersFound.push(num);
        return numbersFound;
      }, []);

    return partNumbers;
  };

  return gearIndexes
    .map(getPartNumbersAt)
    .filter((partNumbers) => partNumbers.length === 2)
    .map((partNumbers) => partNumbers.map(({ number }) => number).product())
    .sum();
};

console.log('\x1b[31m--- DATA---\x1b[0m\n', data);
console.log('\x1b[31m--- TEST PART ONE ---\x1b[0m\n', partOne(testOne));
console.log('\x1b[31m--- TEST PART TWO ---\x1b[0m\n', partTwo(testTwo));
console.log();
console.log('\x1b[31m--- PART ONE ---\x1b[0m\n', partOne(data));
console.log('\x1b[31m--- PART TWO ---\x1b[0m\n', partTwo(data));
