const path = require('path');
const fs = require('fs');

const day5 = (input) => {
  const ROW = { MIN: 0, MAX: 127, CODE_LENGTH: 7 };
  const COLUMN = { MIN: 0, MAX: 7, CODE_LENGTH: 3 };

  const data = input.split('\n');

  const binary_search = (low, hi, shouldSelectFirstHalf) => {
    let iteration = 0;
    while (hi - low > 1) {
      const mid = Math.floor((hi - low) / 2 + low);
      if (shouldSelectFirstHalf(iteration++)) hi = mid;
      else low = mid;
    }
    return shouldSelectFirstHalf(iteration) ? low : hi;
  };

  const getRow = (code) => {
    return binary_search(
      ROW.MIN,
      ROW.MAX,
      (iteration) => code[iteration] === 'F'
    );
  };

  const getColumn = (code) => {
    return binary_search(
      COLUMN.MIN,
      COLUMN.MAX,
      (iteration) => code[ROW.CODE_LENGTH + iteration] === 'L'
    );
  };

  const getSeatId = (row, column) => row * 8 + column;

  const getSeatIdForCode = (code) => getSeatId(getRow(code), getColumn(code));

  const part1 = () => {
    return data.reduce(
      (highest, nextCode) => Math.max(highest, getSeatIdForCode(nextCode)),
      0
    );
  };

  const part2 = () => {
    const maxSeatId = getSeatId(getRow(ROW.MAX), getColumn(COLUMN.MAX));
    const assignedSeats = Array.from({ length: maxSeatId });
    const presentId = { min: null, max: null };

    data.forEach((code) => {
      const id = getSeatIdForCode(code);
      assignedSeats[id] = true;

      if (!presentId.min && !presentId.max) {
        presentId.min = presentId.max = id;
      } else {
        presentId.min = Math.min(id, presentId.min);
        presentId.max = Math.max(id, presentId.max);
      }

      return id;
    });

    return Object.keys(assignedSeats).filter(
      (id) => !assignedSeats[id] && id > presentId.min && id < presentId.max
    );
  };

  return { part1, part2 };
};

const input = fs.readFileSync(path.resolve(__dirname, 'input'), 'UTF-8');
Object.values(day5(input)).forEach((solution, index) =>
  console.log(`Part ${index + 1}`, solution())
);
