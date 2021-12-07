import { Input } from '../../shared/types';
import { countFishAfterNDays } from './_solution';
import day from './index';
import { parse } from './_parse';
import readInput from '../../utils/readInput';

const firstSample = '3,4,3,1,2';

describe('Parse', () => {
  const input = firstSample;

  it('Should parse sample input', () => {
    const expected = [3, 4, 3, 1, 2];
    expect(parse(input)).toEqual(expected);
  });
});

describe('Count Fish After N Days', () => {
  const data = parse(firstSample);

  it('Should calculate after 18 days', () => {
    expect(countFishAfterNDays(data, 18)).toEqual(26);
  });
});

describe('First sample', () => {
  const input = firstSample as Input;
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('5934');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('26984457539');
  });
});

describe('Final sample', () => {
  const input = readInput(6);
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('359344');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('1629570219571');
  });
});
