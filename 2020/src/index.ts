import Solution from './interfaces/solution.interface';
import config from './config';
import {performance} from 'perf_hooks';
import readInput from './utils/read_input';
import {readSolutionDayNumber} from './utils/read_arguments';

// The most important part (:
const xmasEmojis = ['🎄', '🏂', '✨', '⭐️', '🍪', '🎅', '🧝‍♀️', '🧝‍♂️', '🎁'];

const getRandomXmasEmoji = (): string => {
  return xmasEmojis[Math.round(Math.random() * (xmasEmojis.length - 1))];
};

const printSolutionOutput = (solution: Solution, part: number) => {
  console.log(`==  Executing Part ${part}`);
  const startTime = performance.now();
  const output = solution();
  const endTime = performance.now();
  console.log('==>', output);
  console.log(
    `==> Time (ms): ${Math.round((endTime - startTime) * 100) / 100}\n`
  );
};

const printDaySolutions = async () => {
  const dayNumber = readSolutionDayNumber();
  const dayInput = readInput(dayNumber);
  const dayDirPath = config.dayDirectoryPath(dayNumber);
  const solutions: Solution[] = (await import(dayDirPath)).default(dayInput);
  console.log(`== Printing dayNumber: ${dayNumber} ${getRandomXmasEmoji()}\n`);
  solutions.forEach((sol, index) => printSolutionOutput(sol, index + 1));
};

printDaySolutions();
