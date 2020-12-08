import fs from 'fs';

const readFromFile = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf-8');
};

export default readFromFile;
