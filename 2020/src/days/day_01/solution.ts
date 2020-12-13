import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

const day1: Day = (input: DayInput) => {
  const data = input.split('\n').map(e => parseInt(e));

  const findNNumsThatSumsTo = (
    arr: number[],
    n: number,
    targetSum: number,
    numsFound: number[] = [],
    lookup: number = 0
  ): number[] => {
    if (n <= 0) return targetSum === 0 ? numsFound : [];
    for (let i = lookup; i < arr.length - n; ++i) {
      const sum = targetSum - arr[i];
      let next = [...numsFound, arr[i]];
      next = findNNumsThatSumsTo(arr, n - 1, sum, next, i + 1);
      if (next.length) return next;
    }
    return [];
  };

  const getProductOfNums = (nums: number[]) => {
    return nums.reduce((a, b) => a * b, 1);
  };

  const partOne = () => {
    return getProductOfNums(findNNumsThatSumsTo(data, 2, 2020));
  };

  const partTwo = () => {
    return getProductOfNums(findNNumsThatSumsTo(data, 3, 2020));
  };

  return [partOne, partTwo];
};

export default day1;
