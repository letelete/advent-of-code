import day from './solution';
import readInput from '../../utils/read_input';

describe('First sample', () => {
  const input = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;

  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 4 with a sample input', () => {
      expect(partOne()).toEqual(4);
    });
  });

  describe('Part two', () => {
    it('should return 32 with a sample input', () => {
      expect(partTwo()).toEqual(32);
    });
  });
});
describe('Second sample', () => {
  const input = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;
  const [_, partTwo] = day(input);

  describe('Part two', () => {
    it('should return 126 with a sample input', () => {
      expect(partTwo()).toEqual(126);
    });
  });
});

describe('Final sample', () => {
  const input = readInput(7);
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 164 with a sample input', () => {
      expect(partOne()).toEqual(164);
    });
  });

  describe('Part two', () => {
    it('should return 7872 with a sample input', () => {
      expect(partTwo()).toEqual(7872);
    });
  });
});
