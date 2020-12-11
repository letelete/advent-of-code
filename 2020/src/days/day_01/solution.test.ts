import day from './solution';
import readInput from '../../utils/read_input';

describe('First sample', () => {
  const input = '1721\n979\n366\n299\n675\n1456';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 514579 with a sample input', () => {
      expect(partOne()).toEqual(514579);
    });
  });

  describe('Part two', () => {
    it('should return 241861950 with a sample input', () => {
      expect(partTwo()).toEqual(241861950);
    });
  });
});

describe('Final sample', () => {
  const input = readInput(1);
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 902451 with a sample input', () => {
      expect(partOne()).toEqual(902451);
    });
  });

  describe('Part two', () => {
    it('should return 85555470 with a sample input', () => {
      expect(partTwo()).toEqual(85555470);
    });
  });
});
