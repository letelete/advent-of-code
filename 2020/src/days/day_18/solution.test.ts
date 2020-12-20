import day from './solution';

describe('No nesting depth', () => {
  const input = '1 + 2 * 3 + 4 * 5 + 6';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 71 with a sample input', () => {
      expect(partOne()).toEqual(71);
    });
  });

  describe('Part two', () => {
    it('should return 231 with a sample input', () => {
      expect(partTwo()).toEqual(231);
    });
  });
});

describe('Maximal nesting depth of 2', () => {
  const input = '1 + (2 * 3) + (4 * (5 + 6))';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 51 with a sample input', () => {
      expect(partOne()).toEqual(51);
    });
  });

  describe('Part two', () => {
    it('should return 51 with a sample input', () => {
      expect(partTwo()).toEqual(51);
    });
  });
});

describe('Longest sample', () => {
  const input = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 13632 with a sample input', () => {
      expect(partOne()).toEqual(13632);
    });
  });

  describe('Part two', () => {
    it('should return 23340 with a sample input', () => {
      expect(partTwo()).toEqual(23340);
    });
  });
});
