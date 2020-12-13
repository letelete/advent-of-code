import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

const day6: Day = (input: DayInput) => {
  const data: string[][] = input
    .split(/\n\n/)
    .map(group => group.split(/[\s\n]/));

  const partOne = () => {
    return data.reduce(
      (sum: number, group: string[]): number =>
        sum +
        new Set(
          group.reduce(
            (arr: string[], vote: string): string[] => [...arr, ...vote],
            []
          )
        ).size,
      0
    );
  };

  const partTwo = () => {
    return data.reduce(
      (sum: number, group: string[]): number =>
        sum +
        group.reduce(
          (intersected: string[], vote: string): string[] => {
            const uniqueAnswers = new Set([...vote]);
            return intersected.filter(e => uniqueAnswers.has(e));
          },
          [...new Set([...group[0]])]
        ).length,
      0
    );
  };

  return [partOne, partTwo];
};

export default day6;
