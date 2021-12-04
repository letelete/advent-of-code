import { Data } from './_types';
import { Input } from '../../shared/types';

export const parse = (input: Input): Data => {
  const boardSize = 5;
  const splitted = input.split('\n').filter((e) => !!e);
  const rounds = splitted[0].split(',').map((e) => parseInt(e));
  const boards = splitted.slice(1).reduce((b, row, index) => {
    const formattedRow = row
      .split(' ')
      .filter((e) => !!e)
      .map((e) => parseInt(e));
    if (index % boardSize === 0) return [...b, [formattedRow]];
    return [...b.slice(0, b.length - 1), [...b[b.length - 1], formattedRow]];
  }, [] as number[][][]);
  return {
    rounds,
    boards,
  };
};
