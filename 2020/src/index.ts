import Day from './interfaces/day.interface';
import config from './config';
import {readSolutionDay} from './utils/read_arguments';

const printDaySolutions = async () => {
  const day = readSolutionDay();
  const dayDirPath = config.dayDirectoryPath(day);
  const {solutions}: Day = (await import(dayDirPath)).default();
  console.log('Printing day', `[${day}]`, '\n---');
  solutions.forEach((solution, index) => {
    console.log(`Part ${index + 1}\n`, solution());
  });
};

printDaySolutions();
