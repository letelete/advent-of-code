import { Coords, CoordsWithAim, Data, Instruction } from './_types';

export type States = { [key in Instruction]: () => Coords };

export const taskStates: States = {
  down: () => ({ x: 0, y: 1 }),
  up: () => ({ x: 0, y: -1 }),
  forward: () => ({ x: 1, y: 0 }),
};

export const runInstructions = (data: Data, states: States) => {
  return data.map((entry) => {
    const move = states[entry.instruction]();
    return { x: move.x * entry.value, y: move.y * entry.value };
  });
};

export const applyMoves = (initial: Coords, moves: Coords[]) => {
  return moves.reduce(
    (pos, entry) => ({
      x: pos.x + entry.x,
      y: pos.y + entry.y,
    }),
    initial
  );
};

export const applyMovesWithAim = (initial: CoordsWithAim, moves: Coords[]) => {
  return moves.reduce((pos: CoordsWithAim, entry) => {
    const x = pos.x + entry.x;
    const y = pos.y + pos.aim * entry.x;
    const aim = pos.aim + entry.y;
    return { x, y, aim };
  }, initial);
};
