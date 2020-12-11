import day from './solution';
import readInput from '../../utils/read_input';

describe('First sample', () => {
  const input = '1-3 a: abcde\n1-3 b: cdefg\n2-9 c: ccccccccc';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 2 with a sample input', () => {
      expect(partOne()).toEqual(2);
    });
  });

  describe('Part two', () => {
    it('should return 1 with a sample input', () => {
      expect(partTwo()).toEqual(1);
    });
  });
});

describe('Final sample', () => {
  const input = readInput(2);
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 474 with a sample input', () => {
      expect(partOne()).toEqual(474);
    });
  });

  describe('Part two', () => {
    it('should return 745 with a sample input', () => {
      expect(partTwo()).toEqual(745);
    });
  });
});
