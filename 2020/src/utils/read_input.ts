import config from '../config';
import readFromFile from './read_file';

const readInput = (day: number): string => {
  const filePath = config.inputDirectoryPath(day);
  return readFromFile(filePath);
};

export default readInput;
