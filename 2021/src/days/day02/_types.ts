export type Instruction = 'forward' | 'up' | 'down';

export type Entry = {
  instruction: Instruction;
  value: number;
};

export type Data = Entry[];

export type Coords = {
  x: number;
  y: number;
};

export type CoordsWithAim = Coords & {
  aim: number;
};
