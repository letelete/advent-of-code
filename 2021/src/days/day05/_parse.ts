import { Coords, Data, Line } from './_types';

import { Input } from '../../shared/types';

export const parse = (input: Input): Data => {
  return input.split('\n').map((row) =>
    row
      .split(' -> ')
      .map((pair) => pair.split(','))
      .reduce(
        (data: Line, pair: string[], index: number) => {
          const coords = {
            x: parseInt(pair[0]),
            y: parseInt(pair[1]),
          } as Coords;
          return {
            from: index === 0 ? coords : data.from,
            to: index === 1 ? coords : data.to,
          } as Line;
        },
        { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } } as Line
      )
  );
};
