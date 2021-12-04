import { DayProps, Input } from '../../shared/types';
import {
  calcBoardScore,
  findWinningBoards,
  isWinningBoard,
  withMarkedWinningNumbers,
} from './_solution';

import { Data } from './_types';
import day from './index';
import { parse } from './_parse';
import readInput from '../../utils/readInput';
import { winningMark } from './_shared';

const firstSample =
  '7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1\n22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16  7\n 6 10  3 18  5\n 1 12 20 15 19\n 3 15  0  2 22\n 9 18 13 17  5\n19  8  7 25 23\n20 11 10 24  4\n14 21 16 12  6\n14 21 17 24  4\n10 16 15  9 19\n18  8 23 26 20\n22 11 13  6  5\n 2  0 12  3  7';

describe('Parse', () => {
  const input = firstSample;

  it('Should parse sample input', () => {
    const expected = {
      rounds: [
        7,
        4,
        9,
        5,
        11,
        17,
        23,
        2,
        0,
        14,
        21,
        24,
        10,
        16,
        13,
        6,
        15,
        25,
        12,
        22,
        18,
        20,
        8,
        19,
        3,
        26,
        1,
      ],
      boards: [
        [
          [22, 13, 17, 11, 0],
          [8, 2, 23, 4, 24],
          [21, 9, 14, 16, 7],
          [6, 10, 3, 18, 5],
          [1, 12, 20, 15, 19],
        ],
        [
          [3, 15, 0, 2, 22],
          [9, 18, 13, 17, 5],
          [19, 8, 7, 25, 23],
          [20, 11, 10, 24, 4],
          [14, 21, 16, 12, 6],
        ],
        [
          [14, 21, 17, 24, 4],
          [10, 16, 15, 9, 19],
          [18, 8, 23, 26, 20],
          [22, 11, 13, 6, 5],
          [2, 0, 12, 3, 7],
        ],
      ],
    } as Data;

    expect(parse(input)).toEqual(expected);
  });
});

describe('Check board', () => {
  it('Should find winning row', () => {
    const board = [
      [14, 21, 17, 24, winningMark],
      [10, 16, 15, winningMark, 2],
      [winningMark, winningMark, winningMark, winningMark, winningMark],
      [22, winningMark, 13, 6, 24],
      [2, 0, 12, 3, 12],
    ];
    expect(isWinningBoard(board)).toEqual(true);
  });

  it('Should find winning column', () => {
    const board = [
      [14, 21, 17, 24, winningMark],
      [10, 16, 15, 9, winningMark],
      [18, 8, 23, 26, winningMark],
      [22, 11, 13, 6, winningMark],
      [2, 0, 12, 3, winningMark],
    ];
    expect(isWinningBoard(board)).toEqual(true);
  });

  it('Should not find winning row nor column', () => {
    const board = [
      [winningMark, winningMark, winningMark, winningMark, 4],
      [winningMark, winningMark, winningMark, winningMark, 19],
      [winningMark, winningMark, winningMark, winningMark, 20],
      [winningMark, winningMark, winningMark, winningMark, 5],
      [2, 0, 12, 3, 7],
    ];
    expect(isWinningBoard(board)).toEqual(false);
  });
});

describe('Calculate board score', () => {
  it('Should filter out marked cells', () => {
    const board = [
      [1, 1, 1, 1, winningMark],
      [1, 1, 1, winningMark, 1],
      [winningMark, winningMark, winningMark, winningMark, winningMark],
      [1, winningMark, 1, 1, 1],
      [1, 1, winningMark, winningMark, 1],
    ];
    expect(calcBoardScore(board)).toEqual(15);
  });

  it('Should filter out marked cells', () => {
    const board = [
      [1, 2, 3, 4, 5],
      [0, 0, 0, 0, 0],
      [winningMark, winningMark, 0, 0, 0],
      [winningMark, 10, winningMark, 20, winningMark],
      [0, 0, winningMark, 0, 0],
    ];
    expect(calcBoardScore(board)).toEqual(45);
  });
});

describe('With marked winning numbers', () => {
  it('Should update board with unique numbers with winning mark', () => {
    const board = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ];
    expect(withMarkedWinningNumbers(board, 5)).toEqual([
      [1, 2, 3, 4, winningMark],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ]);
  });

  it('Should update board with repeating numbers with winning mark', () => {
    const board = [
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
      [1, 2, 3, 3, 2],
      [1, 2, 2, 2, 2],
      [5, 4, 3, 5, 1],
    ];
    expect(withMarkedWinningNumbers(board, 2)).toEqual([
      [1, winningMark, 3, 4, 5],
      [5, 4, 3, winningMark, 1],
      [1, winningMark, 3, 3, winningMark],
      [1, winningMark, winningMark, winningMark, winningMark],
      [5, 4, 3, 5, 1],
    ]);
  });

  it('Should leave the board as is', () => {
    const board = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ];
    expect(withMarkedWinningNumbers(board, 26)).toEqual(board);
  });
});

describe('Find winning number', () => {
  const input = parse(firstSample as Input);

  it('Round number', () => {
    expect(findWinningBoards(input)[0].recentNumber).toEqual(24);
  });

  it('Board score', () => {
    expect(findWinningBoards(input)[0].score).toEqual(188);
  });
});

describe('First sample', () => {
  const input = firstSample as Input;
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('4512');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('1924');
  });
});

describe('Final sample', () => {
  const input = readInput(4);
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('55770');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('2980');
  });
});
