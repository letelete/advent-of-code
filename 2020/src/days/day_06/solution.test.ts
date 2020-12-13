import day from './solution';
import readInput from '../../utils/read_input';

describe('First sample', () => {
  const input = 'abcx\nabcy\nabcz';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 6 with a sample input', () => {
      expect(partOne()).toEqual(6);
    });
  });
});

describe('Second sample', () => {
  const input = `abc

a
b
c

ab
ac

a
a
a
a

b`;

  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 11 with a sample input', () => {
      expect(partOne()).toEqual(11);
    });
  });

  describe('Part two', () => {
    it('should return 6 with a sample input', () => {
      expect(partTwo()).toEqual(6);
    });
  });
});

describe('Final sample', () => {
  const input = readInput(6);
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 6630 with a sample input', () => {
      expect(partOne()).toEqual(6630);
    });
  });

  describe('Part two', () => {
    it('should return 3437 with a sample input', () => {
      expect(partTwo()).toEqual(3437);
    });
  });
});
