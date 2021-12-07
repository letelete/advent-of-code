import { Board, Data, Line } from './_types';
import { DayProps, Input } from '../../shared/types';
import { countOverlaps, generateLinePath } from './_solution';

import day from './index';
import { parse } from './_parse';
import readInput from '../../utils/readInput';

const firstSample =
  '0,9 -> 5,9\n8,0 -> 0,8\n9,4 -> 3,4\n2,2 -> 2,1\n7,0 -> 7,4\n6,4 -> 2,0\n0,9 -> 2,9\n3,4 -> 1,4\n0,0 -> 8,8\n5,5 -> 8,2';

describe('Parse', () => {
  const input = firstSample;

  it('Should parse sample input', () => {
    const expected = [
      { from: { x: 0, y: 9 }, to: { x: 5, y: 9 } },
      { from: { x: 8, y: 0 }, to: { x: 0, y: 8 } },
      { from: { x: 9, y: 4 }, to: { x: 3, y: 4 } },
      { from: { x: 2, y: 2 }, to: { x: 2, y: 1 } },
      { from: { x: 7, y: 0 }, to: { x: 7, y: 4 } },
      { from: { x: 6, y: 4 }, to: { x: 2, y: 0 } },
      { from: { x: 0, y: 9 }, to: { x: 2, y: 9 } },
      { from: { x: 3, y: 4 }, to: { x: 1, y: 4 } },
      { from: { x: 0, y: 0 }, to: { x: 8, y: 8 } },
      { from: { x: 5, y: 5 }, to: { x: 8, y: 2 } },
    ];
    expect(parse(input)).toEqual(expected);
  });
});

describe('Generate line path', () => {
  it('Should generate a sample line 1', () => {
    const line = { from: { x: 1, y: 1 }, to: { x: 1, y: 3 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ]);
  });

  it('Should generate a sample line 2', () => {
    const line = { from: { x: 9, y: 7 }, to: { x: 7, y: 7 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 9, y: 7 },
      { x: 8, y: 7 },
      { x: 7, y: 7 },
    ]);
  });

  it('Should generate a sample line 3', () => {
    const line = { from: { x: 0, y: 9 }, to: { x: 5, y: 9 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 0, y: 9 },
      { x: 1, y: 9 },
      { x: 2, y: 9 },
      { x: 3, y: 9 },
      { x: 4, y: 9 },
      { x: 5, y: 9 },
    ]);
  });

  it('Should generate a straight, forward vertical line path', () => {
    const line = { from: { x: 0, y: 0 }, to: { x: 0, y: 2 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ]);
  });

  it('Should generate a straight, backward vertical line path', () => {
    const line = { from: { x: 0, y: 2 }, to: { x: 0, y: 0 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
    ]);
  });

  it('Should generate a straight, forward horizontal line path', () => {
    const line = { from: { x: 1, y: 1 }, to: { x: 3, y: 1 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ]);
  });

  it('Should generate a straight, backward horizontal line path', () => {
    const line = { from: { x: 3, y: 1 }, to: { x: 1, y: 1 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it('Should generate a diagonal, forward line path', () => {
    const line = { from: { x: 1, y: 0 }, to: { x: 3, y: 2 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 2 },
    ]);
  });

  it('Should generate a diagonal, backward line path', () => {
    const line = { from: { x: 3, y: 2 }, to: { x: 1, y: 0 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 3, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 0 },
    ]);
  });

  it('Should generate a diagonal, x backward y forward line path', () => {
    const line = { from: { x: 3, y: 0 }, to: { x: 1, y: 2 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 3, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ]);
  });

  it('Should generate a diagonal, x forward y backward line path', () => {
    const line = { from: { x: 1, y: 2 }, to: { x: 3, y: 0 } } as Line;
    expect(generateLinePath(line)).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 3, y: 0 },
    ]);
  });
});

describe('Count overlaps', () => {
  it('Should count existing overlaps', () => {
    const lines = [
      { from: { x: 1, y: 0 }, to: { x: 1, y: 3 } },
      { from: { x: 1, y: 2 }, to: { x: 3, y: 2 } },
      { from: { x: 3, y: 2 }, to: { x: 1, y: 2 } },
      { from: { x: 1, y: 2 }, to: { x: 3, y: 2 } },
    ];
    // [0, 1, 0, 0],
    // [0, 1, 0, 0],
    // [0, 4, 3, 3],
    // [0, 1, 0, 0],
    expect(countOverlaps(lines)).toEqual(3);
  });

  it('Should not find any overlaps', () => {
    const lines = [
      { from: { x: 1, y: 0 }, to: { x: 1, y: 3 } },
      { from: { x: 3, y: 2 }, to: { x: 2, y: 2 } },
    ];
    // [0, 1, 0, 0],
    // [0, 1, 0, 0],
    // [0, 1, 1, 1],
    // [0, 1, 0, 0],
    expect(countOverlaps(lines)).toEqual(0);
  });
});

describe('First sample', () => {
  const input = firstSample as Input;
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('5');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('12');
  });
});

// describe('Final sample', () => {
//   const input = readInput(4);
//   const {
//     parts: [partOne, partTwo],
//   } = day({ input });

//   it('Part one', () => {
//     expect(partOne()).toEqual('8060');
//   });

//   it('Part two', () => {
//     expect(partTwo()).toEqual('21577');
//   });
// });
