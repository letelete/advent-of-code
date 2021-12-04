import { Board, Data, Winner } from './_types';

import { winningMark } from './_shared';

export const isWinningBoard = (board: Board): boolean => {
  return (
    board
      .map((row, index) => {
        const filteredRow = row.filter((cell) => cell === winningMark);
        const filteredColumn = board
          .map((rows) => rows[index])
          .filter((cell) => cell === winningMark);
        return Math.max(filteredRow.length, filteredColumn.length);
      })
      .filter((length) => length === board[0].length).length > 0
  );
};

export const calcBoardScore = (markedBoard: Board): number => {
  return markedBoard.reduce((score, row) => {
    return (
      score +
      row
        .filter((cell) => cell !== winningMark)
        .reduce((subScore, number) => subScore + number, 0)
    );
  }, 0);
};

export const withMarkedWinningNumbers = (
  board: Board,
  roundNumber: number
): Board => {
  return board.map((row) =>
    row.map((number) => (number === roundNumber ? winningMark : number))
  );
};

export const findWinningBoards = (data: Data): Winner[] => {
  return data.rounds.reduce(
    ({ winners, markedBoards }, roundNumber) => ({
      winners,
      markedBoards: markedBoards
        .map((board) => withMarkedWinningNumbers(board, roundNumber))
        .map((markedBoard) => {
          if (!isWinningBoard(markedBoard)) return markedBoard;
          winners.push({
            score: calcBoardScore(markedBoard),
            recentNumber: roundNumber,
          });
          return [];
        }),
    }),
    {
      winners: [] as Winner[],
      markedBoards: data.boards,
    }
  ).winners;
};
