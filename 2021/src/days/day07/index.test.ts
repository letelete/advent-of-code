import { Input } from '../../shared/types';
import day from '.';
import { parse } from './_parse';
import readInput from '../../utils/readInput';

const firstSample = '16,1,2,0,4,2,7,1,2,14';

describe('Parse', () => {
  const input = firstSample;

  it('Should parse sample input', () => {
    const expected = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];
    expect(parse(input)).toEqual(expected);
  });
});

describe('First sample', () => {
  const input = firstSample as Input;
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('37');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('168');
  });
});

describe('Final sample', () => {
  const input = readInput(7);
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('335330');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('92439766');
  });
});
