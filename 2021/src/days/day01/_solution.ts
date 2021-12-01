import { Data } from './_types';

export const accumulate = (arr: number[]) => {
  return arr.reduce((sum, element) => sum + element, 0);
};

export const countIncreases = (data: number[]) => {
  return data
    .map((element, index) => !!(index < 1 ? 0 : element > data[index - 1]))
    .filter((e) => !!e).length;
};

export const groupIntoChunks = (data: number[], windowWidth: number) => {
  if (windowWidth < 1) {
    throw new Error('Window width must be a positive number');
  }
  return data.reduce((chunks, _, index) => {
    if (index > data.length - windowWidth) return chunks;
    return [...chunks, data.slice(index, index + windowWidth)];
  }, [] as number[][]);
};
