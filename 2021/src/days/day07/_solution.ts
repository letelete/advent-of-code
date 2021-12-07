import { Data } from './_types';

export const findBestAlignmentCost = (
  data: Data,
  getAlignmentCost: (oldPos: number, newPos: number) => number
): number => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  let best = Infinity;
  for (let newPos = min; newPos <= max; ++newPos) {
    let cost = 0;
    data.forEach((oldPos) => {
      cost += getAlignmentCost(oldPos, newPos);
    });
    best = Math.min(best, cost);
  }
  return best;
};

export const findAlignmentInOwnWay = (data: Data) => {
  return findBestAlignmentCost(data, (oldPos, newPos) => {
    return Math.abs(newPos - oldPos);
  });
};

export const findAlignmentWithCrabEngineering = (data: Data) => {
  return findBestAlignmentCost(data, (oldPos, newPos) => {
    const distance = Math.abs(newPos - oldPos);
    return ((1 + distance) / 2) * distance;
  });
};
