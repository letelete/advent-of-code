import { DayProps, Input } from '../../shared/types';
import {
  columnsToRows,
  countBits,
  countCharactersInString,
  determineCO2Rating,
  determineEpsilonRate,
  determineGammaRate,
  determineOxygenRating,
  findByBitCriteria,
} from './_solution';

import day from './index';
import { parse } from './_parse';
import readInput from '../../utils/readInput';

const firstSample =
  '00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010';

describe('Parse', () => {
  const input = firstSample;

  it('Should parse sample input', () => {
    const expected = [
      '00100',
      '11110',
      '10110',
      '10111',
      '10101',
      '01111',
      '00111',
      '11100',
      '10000',
      '11001',
      '00010',
      '01010',
    ];
    expect(parse(input)).toEqual(expected);
  });
});

describe('Columns to rows', () => {
  it('Should transform square', () => {
    const input = ['0110', '1001', '1010', '1010'];
    expect(columnsToRows(input)).toEqual(['0111', '1000', '1011', '0100']);
  });

  it('Should transform rectangle', () => {
    const input = ['0110000', '1001100'];
    expect(columnsToRows(input)).toEqual([
      '01',
      '10',
      '10',
      '01',
      '01',
      '00',
      '00',
    ]);
  });
});

describe('Count characters in string', () => {
  it('Should count zeros and ones', () => {
    const input = '01110110';
    const expected = new Map([
      ['0', 3],
      ['1', 5],
    ]);
    expect(countCharactersInString(input)).toEqual(expected);
  });
});

describe('Count bits', () => {
  it('Should count bits', () => {
    const input = ['101', '000', '111', '001'];
    const expected = [
      new Map([
        ['0', 1],
        ['1', 2],
      ]),
      new Map([
        ['0', 3],
        ['1', 0],
      ]),
      new Map([
        ['0', 0],
        ['1', 3],
      ]),
      new Map([
        ['0', 2],
        ['1', 1],
      ]),
    ];
    expect(countBits(input)).toEqual(expected);
  });
});

describe('Determine gamma rate', () => {
  it('Should find sample gamma rate binary number', () => {
    const input = parse(firstSample);
    const transformed = columnsToRows(input);
    const occurrences = countBits(transformed);
    expect(determineGammaRate(occurrences)).toEqual('10110');
  });
});

describe('Determine epsilon rate', () => {
  it('Should find epsilon rate binary number', () => {
    const input = parse(firstSample);
    const transformed = columnsToRows(input);
    const occurrences = countBits(transformed);
    expect(determineEpsilonRate(occurrences)).toEqual('01001');
  });
});

describe('Find bit by criteria', () => {
  it('Should find bit by criteria', () => {
    const data = parse(firstSample);
    expect(
      findByBitCriteria(data, (columnOccurs, currentChar) => {
        const occursOfZero = columnOccurs.get('0') || 0;
        const occursOfOne = columnOccurs.get('1') || 0;
        return currentChar === (occursOfZero <= occursOfOne ? '0' : '1');
      })
    ).toEqual(['01010']);
  });
});

describe('Determine oxygen rate', () => {
  it('Should find oxygen rate binary number', () => {
    const data = parse(firstSample);
    expect(determineOxygenRating(data)).toEqual('10111');
  });
});

describe('Determine co2 scrubber rate', () => {
  it('Should find co2 scrubber rate binary number', () => {
    const data = parse(firstSample);
    expect(determineCO2Rating(data)).toEqual('01010');
  });
});

describe('First sample', () => {
  const input = firstSample as Input;
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('198');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('230');
  });
});

describe('Final sample', () => {
  const input = readInput(3);
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('4139586');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('1800151');
  });
});
