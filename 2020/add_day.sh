#!/bin/bash

DAY=$1

DAY_DIR_PATH="./src/days/day_$1"
[[ -d $DAY_DIR_PATH ]] && echo "Direcotry <$DAY_DIR_PATH> already exists. Aborting..." && exit 0

mkdir $DAY_DIR_PATH
cd $DAY_DIR_PATH

# Create a solution.ts file
echo "import Day from '../../interfaces/day.interface';
import readInput from '../../utils/read_input';

const day$DAY = (): Day => {
const data: string = readInput(str => 'test' /* TODO: Parse the input */);

// TODO: Implement part one
const partOne = () => {
return '';
};

// TODO: Implement part two
const partTwo = () => {
return '';
};

return {solutions: [partOne, partTwo]};
};

export default day$DAY;
" >solution.ts

# Create an input file
echo >input

# Create a test file
echo >solution.test.ts

echo "Happy Coding! 🎄🎅"

code .
