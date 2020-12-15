import day from './solution';

describe('First sample', () => {
  const input = '0,3,6';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 436 with a sample input', () => {
      expect(partOne()).toEqual(436);
    });
  });

  describe('Part two', () => {
    it('should return 175594 with a sample input', () => {
      expect(partTwo()).toEqual(175594);
    });
  });
});
