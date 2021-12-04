export type Board = number[][];

export type Winner = {
  score: number;
  recentNumber: number;
};

export type Data = {
  rounds: number[];
  boards: Board[];
};
