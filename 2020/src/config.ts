import path from 'path';

const resolveFilePathAtDayDir = (day: number, fileName: string) => {
  const dayNumber: string = day < 10 ? `0${day}` : day.toString();
  return path.resolve(__dirname, `../src/days/day_${dayNumber}/${fileName}`);
};

const config = {
  aocFirstDay: 1,
  aocLastDay: 25,
  dayDirectoryPath: (day: number) =>
    resolveFilePathAtDayDir(day, 'solution.ts'),
  inputDirectoryPath: (day: number) => resolveFilePathAtDayDir(day, 'input'),
};

export default config;
