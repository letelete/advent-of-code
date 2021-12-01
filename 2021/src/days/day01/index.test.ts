import { DayProps, Input } from '../../shared/types';
import { accumulate, countIncreases, groupIntoChunks } from './_solution';

import day from './index';
import { parse } from './_parse';
import readInput from '../../utils/readInput';

const firstSample = '199\n200\n208\n210\n200\n207\n240\n269\n260\n263';

describe('Parse', () => {
  const input = '199\n200\n208';

  it('Should parse basic input', () => {
    expect(parse(input)).toEqual([199, 200, 208]);
  });
});

describe('Count increases', () => {
  it('should count increases in incremental, unique environment', () => {
    const data = [0, 1, 2, 3, 4];
    expect(countIncreases(data)).toEqual(4);
  });
  it('should count increases in repeatable, chaotic environment', () => {
    const data = [0, 1, 2, 1, -1, 0, 2, 12, 3, 3, 4];
    expect(countIncreases(data)).toEqual(6);
  });
});

describe('Group into chunks', () => {
  it('should group by 3', () => {
    const data = [0, 1, 2, 3, 4];
    expect(groupIntoChunks(data, 3)).toEqual([
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 4],
    ]);
  });
  it('should group by 1', () => {
    const data = [0, 1, 2, 3, 4];
    expect(groupIntoChunks(data, 1)).toEqual([[0], [1], [2], [3], [4]]);
  });
});

describe('Accumulate', () => {
  it('should accumulate', () => {
    const data = [0, 1, 2, 3];
    expect(accumulate(data)).toEqual(0 + 1 + 2 + 3);
  });
});

describe('First sample', () => {
  const input = firstSample as Input;
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('7');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('5');
  });
});

describe('Final sample', () => {
  const input = readInput(1);
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('1390');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('1457');
  });
});
