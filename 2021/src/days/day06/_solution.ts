import { Data } from './_types';

export const countFishAfterNDays = (
  initialState: Data,
  days: number
): number => {
  const tracker = new Array<number>(9).fill(0);
  initialState.forEach((timer) => ++tracker[timer]);
  return [...Array(days)]
    .reduce((tracker: number[]) => {
      const parents = tracker.shift() || 0;
      tracker[6] += parents;
      tracker.push(parents);
      return tracker;
    }, tracker)
    .reduce((sum: number, amount: number) => sum + amount, 0);
};
