import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

interface SortedEntry {
  value: number;
  index: number;
}

const day9: Day = (input: DayInput) => {
  const data: number[] = input.split(/\n/).map(num => parseInt(num));

  const sortedData = data
    .map((value, index): SortedEntry => ({value, index}))
    .sort((a, b) => (a.value < b.value ? -1 : 1));

  const lowerBound = (arr: SortedEntry[], target: number) => {
    let lo = 0;
    let hi = arr.length - 1;
    while (lo <= hi) {
      const mid = Math.round((hi - lo) / 2 + lo);
      if (arr[mid].value < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return lo;
  };

  const findInvalidNumber = (preamble: number): number | null => {
    for (let index = preamble; index < data.length; ++index) {
      let foundMatch = false;

      const target = data[index];
      const targetMidInSorted = lowerBound(sortedData, Math.round(target / 2));

      for (
        let sortedIndex = 0;
        sortedIndex <= targetMidInSorted && !foundMatch;
        ++sortedIndex
      ) {
        const sortedEntry = sortedData[sortedIndex];

        if (sortedEntry.index >= index || sortedEntry.index < index - preamble)
          continue;

        const counterValue = target - sortedEntry.value;
        const counterIndex = lowerBound(sortedData, counterValue);

        foundMatch = sortedData[counterIndex].value === counterValue;
      }

      if (!foundMatch) return target;
    }

    return null;
  };

  const findConsecutiveSum = (num: number, minLength: number): number[] => {
    let begin = 0;
    let end = 0;
    while (begin <= end && end < data.length) {
      while (end - begin + 1 < minLength || num > 0) num -= data[end++];
      if (num < 0) num += data[begin++];
      if (!num) return data.slice(begin, end);
    }
    return [];
  };

  const partOne = () => findInvalidNumber(25);

  const partTwo = () => {
    const target = partOne();
    if (!target) return null;
    const sumSet = findConsecutiveSum(target, 2);
    return Math.min(...sumSet) + Math.max(...sumSet);
  };

  return [partOne, partTwo];
};

export default day9;
