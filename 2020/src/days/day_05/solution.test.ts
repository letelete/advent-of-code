import day from './solution';
import readInput from '../../utils/read_input';

describe('First sample', () => {
  const input = 'FBFBBFFRLR';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 357 with a sample input', () => {
      expect(partOne()).toEqual(357);
    });
  });
});

describe('Final sample', () => {
  const input = readInput(5);
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 933 with a sample input', () => {
      expect(partOne()).toEqual(933);
    });
  });

  describe('Part two', () => {
    it('should return 711 with a sample input', () => {
      expect(partTwo()).toEqual(711);
    });
  });
});
