export type Coords = {
  x: number;
  y: number;
};

export type Line = {
  from: Coords;
  to: Coords;
};

export type Board = number[][];

export type Data = Line[];
