import path from 'path';

export const resolveFilePathAtDayDir = (
  day: number,
  fileName: string
): string => {
  const dayNumber = day < 10 ? `0${day}` : day.toString();
  return path.resolve(__dirname, `../../src/days/day${dayNumber}/${fileName}`);
};

export const config = {
  aocFirstDay: 0,
  aocLastDay: 25,
  dayDirectoryPath: (day: number) => resolveFilePathAtDayDir(day, 'index.ts'),
  inputDirectoryPath: (day: number) => resolveFilePathAtDayDir(day, 'input'),
};
