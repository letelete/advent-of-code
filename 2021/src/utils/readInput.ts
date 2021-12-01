import { Input } from '../shared/types';
import { config } from '../shared/config';
import readFromFile from '../utils/readFile';

const readInput = (day: number): Input => {
  const filePath = config.inputDirectoryPath(day);
  return readFromFile(filePath);
};

export default readInput;
