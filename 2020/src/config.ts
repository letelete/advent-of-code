import path from 'path';

const resolveFilePathAtDayDir = (day: number, fileName: string) => {
  return path.resolve(__dirname, `../src/days/day_${day}/${fileName}`);
};

const config = {
  aocFirstDay: 1,
  aocLastDay: 25,
  dayDirectoryPath: (day: number) =>
    resolveFilePathAtDayDir(day, 'solution.ts'),
  inputDirectoryPath: (day: number) => resolveFilePathAtDayDir(day, 'input'),
};

export default config;
