import day from './solution';

describe('First sample', () => {
  const input = '939\n7,13,x,x,59,x,31,19';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 295 with a sample input', () => {
      expect(partOne()).toEqual(295);
    });
  });

  describe('Part two', () => {
    it('should return 1068781 with a sample input', () => {
      expect(partTwo()).toEqual(1068781);
    });
  });
});

describe('Second sample', () => {
  const input = '939\n17,x,13,19';
  const [_, partTwo] = day(input);

  describe('Part two', () => {
    it('should return 3417 with a sample input', () => {
      expect(partTwo()).toEqual(3417);
    });
  });
});

describe('Third sample', () => {
  const input = '939\n67,7,59,61';
  const [_, partTwo] = day(input);

  describe('Part two', () => {
    it('should return 754018 with a sample input', () => {
      expect(partTwo()).toEqual(754018);
    });
  });
});

describe('Fourth sample', () => {
  const input = '939\n67,x,7,59,61';
  const [_, partTwo] = day(input);

  describe('Part two', () => {
    it('should return 779210 with a sample input', () => {
      expect(partTwo()).toEqual(779210);
    });
  });
});

describe('Fourth sample', () => {
  const input = '939\n67,7,x,59,61';
  const [_, partTwo] = day(input);

  describe('Part two', () => {
    it('should return 1261476 with a sample input', () => {
      expect(partTwo()).toEqual(1261476);
    });
  });
});

describe('Fourth sample', () => {
  const input = '939\n1789,37,47,1889';
  const [_, partTwo] = day(input);

  describe('Part two', () => {
    it('should return 1202161486 with a sample input', () => {
      expect(partTwo()).toEqual(1202161486);
    });
  });
});
