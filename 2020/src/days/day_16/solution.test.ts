import day from './solution';

describe('First sample', () => {
  const input = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;

  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 71 with a sample input', () => {
      expect(partOne()).toEqual(71);
    });
  });
});

describe('Second sample', () => {
  const input = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
1,2,33
15,1,5
55,1,5
5,14,9`;

  const [_, partTwo] = day(input);

  describe('Part two', () => {
    it('should run with a sample input', () => {
      partTwo();
    });
  });
});
