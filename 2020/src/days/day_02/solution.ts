import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

interface Entry {
  lower: number;
  higher: number;
  char: string;
  password: string;
}

const day2: Day = (input: DayInput) => {
  const data: Entry[] = input.split('\n').map(entry => {
    const pattern = /^([0-9]{1,})-([0-9]{1,})\s([a-zA-Z]):\s(.+?)$/;
    const groups = entry.match(pattern)?.slice(1);
    if (!groups)
      throw new Error(`Invalid entry ${JSON.stringify(groups, null, 2)}`);
    return {
      lower: parseInt(groups[0]),
      higher: parseInt(groups[1]),
      char: groups[2],
      password: groups[3],
    };
  });

  const isValidWithOldPolicy = (entry: Entry): boolean => {
    const keyCharOccurs = entry.password
      .split('')
      .filter(char => char === entry.char).length;
    return keyCharOccurs >= entry.lower && keyCharOccurs <= entry.higher;
  };

  const isValidWithOfficialPolicy = (entry: Entry): boolean => {
    let firstIndex = entry.lower - 1;
    let secondIndex = entry.higher - 1;
    return (
      (entry.password[firstIndex] == entry.char &&
        entry.password[secondIndex] !== entry.char) ||
      (entry.password[firstIndex] !== entry.char &&
        entry.password[secondIndex] === entry.char)
    );
  };

  const partOne = () => data.filter(isValidWithOldPolicy).length;

  const partTwo = () => data.filter(isValidWithOfficialPolicy).length;

  return [partOne, partTwo];
};

export default day2;
