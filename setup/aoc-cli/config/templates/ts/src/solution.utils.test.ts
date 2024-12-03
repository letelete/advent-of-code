import * as utils from './solution.utils';

describe('Array.prototype', () => {
  describe('.sum()', () => {
    it('throws on non-numeric array', () => {
      const arr = ['2', '2', '2'];

      expect(() => arr.sum()).toThrow();
    });
    it('passes on numeric array', () => {
      const arr = [2, 2, 2];

      expect(() => arr.sum()).not.toThrow();
    });
    it('calculates sum', () => {
      const arr = [2, 2, 2];

      expect(arr.sum()).toBe(6);
    });
  });
  describe('.product()', () => {
    it('throws on non-numeric array', () => {
      const arr = ['2', '2', '2'];

      expect(() => arr.product()).toThrow();
    });
    it('passes on numeric array', () => {
      const arr = [2, 2, 2];

      expect(() => arr.product()).not.toThrow();
    });
    it('calculates product', () => {
      const arr = [2, 2, 2];

      expect(arr.product()).toBe(8);
    });
  });
});

describe('Comparators', () => {
  describe('Numbers', () => {
    it('sorts numbers ascending', () => {
      const arr = [2, 3, 1, 4, 0, -1, -2];
      const expected = [-2, -1, 0, 1, 2, 3, 4];

      expect([...arr].sort(utils.Comp.num.asc)).toEqual(expected);
    });

    it('sorts numbers descending', () => {
      const arr = [2, 3, 1, 4, 0, -1, -2];
      const expected = [4, 3, 2, 1, 0, -1, -2];

      expect([...arr].sort(utils.Comp.num.desc)).toEqual(expected);
    });
  });
});
