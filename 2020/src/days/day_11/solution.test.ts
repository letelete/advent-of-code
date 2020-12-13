import day from './solution';

describe('First sample', () => {
  const input =
    'L.LL.LL.LL\nLLLLLLL.LL\nL.L.L..L..\nLLLL.LL.LL\nL.LL.LL.LL\nL.LLLLL.LL\n..L.L.....\nLLLLLLLLLL\nL.LLLLLL.L\nL.LLLLL.LL';

  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 37 with a sample input', () => {
      expect(partOne()).toEqual(37);
    });
  });

  describe('Part two', () => {
    it('should return 26 with a sample input', () => {
      expect(partTwo()).toEqual(26);
    });
  });
});
