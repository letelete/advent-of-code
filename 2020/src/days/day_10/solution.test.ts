import day from './solution';

describe('First sample', () => {
  const input = '16\n10\n15\n5\n1\n11\n7\n19\n6\n12\n4';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 35 with a sample input', () => {
      expect(partOne()).toEqual(35);
    });
  });

  describe('Part two', () => {
    it('should return 8 with a sample input', () => {
      expect(partTwo()).toEqual(8);
    });
  });
});

describe('Second sample', () => {
  const input =
    '28\n33\n18\n42\n31\n14\n46\n20\n48\n47\n24\n23\n49\n45\n19\n38\n39\n11\n1\n32\n25\n35\n8\n17\n7\n9\n4\n2\n34\n10\n3';
  const [partOne, partTwo] = day(input);

  describe('Part one', () => {
    it('should return 220 with a sample input', () => {
      expect(partOne()).toEqual(220);
    });
  });

  describe('Part two', () => {
    it('should return 19208 with a sample input', () => {
      expect(partTwo()).toEqual(19208);
    });
  });
});
