import day from './solution';

describe('First sample', () => {
  const input = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 165 with a sample input', () => {
      expect(partOne()).toEqual(165);
    });
  });
});

describe('First sample', () => {
  const input = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;
  const [_, partTwo] = day(input);

  describe('Part two', () => {
    it('should return 208 with a sample input', () => {
      expect(partTwo()).toEqual(208);
    });
  });
});
