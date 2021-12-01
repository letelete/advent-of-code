import { DayProps, Input } from '../../shared/types';
import { addition, subtraction } from './_solution';

import day from './index';
import { parse } from './_parse';
import readInput from '../../utils/readInput';

const firstSample = '1\n2';

describe('Parse', () => {
  const input = '10\n4';

  it('Should parse basic input', () => {
    expect(parse(input)).toEqual([10, 4]);
  });
});

describe('Addition', () => {
  const data = [1, 2];

  it('Should perform simple addition', () => {
    expect(addition(data)).toEqual(3);
  });
});

describe('Subtraction', () => {
  const data = [1, 2];

  it('Should perform simple subtraction', () => {
    expect(subtraction(data)).toEqual(-1);
  });
});

describe('First sample', () => {
  const input = firstSample as Input;
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('3');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('-1');
  });
});

describe('Final sample', () => {
  const input = readInput(0);
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('1');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('1');
  });
});
