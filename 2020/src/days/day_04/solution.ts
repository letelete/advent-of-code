import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

interface Validation {
  [fieldId: string]: (fieldValue: string) => boolean;
}

interface Entry {
  [key: string]: string;
}

const day3: Day = (input: DayInput) => {
  const data: Entry[] = input.split('\n\n').map(entry =>
    entry
      .replace(/[\r\n]/, ' ')
      .split(/\s/)
      .filter(token => token)
      .reduce((obj, token) => {
        const [key, value] = token.split(':');
        return {...obj, [key]: value};
      }, {})
  );

  const validation: Validation = {
    byr: e => {
      if (isNaN(Number(e))) return false;
      const year = parseInt(e);
      return year >= 1920 && year <= 2002;
    },
    iyr: e => {
      if (isNaN(Number(e))) return false;
      const year = parseInt(e);
      return year >= 2010 && year <= 2020;
    },
    eyr: e => {
      if (isNaN(Number(e))) return false;
      const year = parseInt(e);
      return year >= 2020 && year <= 2030;
    },
    hgt: e => {
      const matches = e.match(/^(\d+)(cm|in)$/);
      if (!matches) return false;
      const number = parseInt(matches[1]);
      return matches[2] == 'cm'
        ? number >= 150 && number <= 193
        : number >= 59 && number <= 76;
    },
    hcl: e => Boolean(e.match(/^#[a-z0-9]{6}$/)),
    ecl: e => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(e),
    pid: e => Boolean(!isNaN(Number(e)) && e.match(/^[0-9]{9}$/)),
  };

  const entriesWithAllRequiredFields = data.filter(
    entry => !Object.keys(validation).some(key => !entry[key])
  );

  const partOne = () => entriesWithAllRequiredFields.length;

  const partTwo = () => {
    return entriesWithAllRequiredFields.filter(
      entry =>
        !Object.entries(entry).some(
          ([key, value]) => key in validation && !validation[key](value)
        )
    ).length;
  };

  return [partOne, partTwo];
};

export default day3;
