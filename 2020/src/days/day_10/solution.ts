import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

interface GapDifference {
  [key: string]: number;
}

const day10: Day = (input: DayInput) => {
  const MAX_GAP = 3;
  const data: number[] = input
    .split(/\n/)
    .map(entry => parseInt(entry))
    .sort((a: number, b: number) => (a < b ? -1 : 1));

  const partOne = () => {
    const diff: GapDifference = {'3': 1, '1': 0};
    const updateGapCounter = (gap: number) => gap in diff && (diff[gap] += 1);

    data.forEach((entry, index) => {
      const gap: number = Math.abs(entry - (index && data[index - 1]));
      if (gap > MAX_GAP) throw new Error(`Gap exceeded at index: ${index}}`);
      updateGapCounter(gap);
    });

    return Object.values(diff).reduce((res, gap) => res * gap, 1);
  };

  const partTwo = () => {
    const table = [0, ...data];
    const dp: number[] = Array.from({length: table.length}, (_, index) =>
      Number(index === table.length - 1)
    );

    for (let left = dp.length - 2; left >= 0; left--) {
      for (let right = left + 1; right < dp.length; right++) {
        const isGapValid = table[right] - table[left] <= MAX_GAP;
        if (!isGapValid) break;
        dp[left] += dp[right];
      }
    }

    return dp[0];
  };

  return [partOne, partTwo];
};

export default day10;
