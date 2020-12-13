#!/bin/bash

DAY=$1

DAY_DIR_PATH=$(sh ./get_day_dirname.sh $DAY)

[[ -d $DAY_DIR_PATH ]] && echo "Direcotry <$DAY_DIR_PATH> already exists. Aborting..." && exit 0

mkdir $DAY_DIR_PATH
cd $DAY_DIR_PATH

# Create a solution.ts file
echo "import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

const day$DAY: Day = (input: DayInput) => {
  const data = input; /* TODO: Parse the input */

  // TODO: Implement part one
  const partOne = () => {
    return '';
  };

  // TODO: Implement part two
  const partTwo = () => {
    return '';
  };

  return [partOne, partTwo];
};

export default day$DAY;
" >solution.ts

# Create a test file
echo "import day from './solution';

describe('First sample', () => {
  const input = '';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return NUMBER with a sample input', () => {
      expect(partOne()).toEqual(NUMBER);
    });
  });

  describe('Part two', () => {
    it('should return DIFFERENTNUMBER with a sample input', () => {
      expect(partTwo()).toEqual(DIFFERENTNUMBER);
    });
  });
});" >solution.test.ts

# Create an input file
echo >input

echo "Happy Coding! 🎄🎅"

code .
