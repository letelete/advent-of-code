import ParsingStrategy from '../interfaces/parsing_strategy.interface';
import config from '../config';
import readFromFile from './read_file';
import {readSolutionDay} from './read_arguments';

const readInput = (strategy: ParsingStrategy): string | null => {
  const day = readSolutionDay();
  const filePath = config.inputDirectoryPath(day);
  const rawInput = readFromFile(filePath);
  return rawInput && strategy(rawInput);
};

export default readInput;
