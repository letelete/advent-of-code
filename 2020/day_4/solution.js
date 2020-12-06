const path = require('path');
const fs = require('fs');

const day4 = (input) => {
  const validation = {
    byr: (e) => {
      if (isNaN(e)) return false;
      const year = parseInt(e);
      return year >= 1920 && year <= 2002;
    },
    iyr: (e) => {
      if (isNaN(e)) return false;
      const year = parseInt(e);
      return year >= 2010 && year <= 2020;
    },
    eyr: (e) => {
      if (isNaN(e)) return false;
      const year = parseInt(e);
      return year >= 2020 && year <= 2030;
    },
    hgt: (e) => {
      const matches = e.match(/^(\d+)(cm|in)$/);
      if (!matches) return false;
      const number = parseInt(matches[1]);
      return matches[2] == 'cm'
        ? number >= 150 && number <= 193
        : number >= 59 && number <= 76;
    },
    hcl: (e) => e.match(/^#[a-z0-9]{6}$/),
    ecl: (e) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(e),
    pid: (e) => !isNaN(e) && e.match(/^[0-9]{9}$/),
  };

  const data = input.split('\n\n').map((entry) =>
    entry
      .replace(/[\r\n]/, ' ')
      .split(/\s/)
      .filter((token) => token)
      .reduce((obj, token) => {
        const [key, value] = token.split(':');
        return { ...obj, [key]: value };
      }, {})
  );

  const entriesWithAllRequiredFields = data.filter(
    (entry) => !Object.keys(validation).some((key) => !entry[key])
  );

  const part1 = () => entriesWithAllRequiredFields.length;

  const part2 = () => {
    const validData = entriesWithAllRequiredFields.filter(
      (entry) =>
        !Object.entries(entry).some(
          ([key, value]) => key in validation && !validation[key](value)
        )
    );
    return validData.length;
  };

  return { part1, part2 };
};

const input = fs.readFileSync(path.resolve(__dirname, 'input'), 'UTF-8');
Object.values(day4(input)).forEach((part, index) =>
  console.log(`Part ${index + 1}`, part())
);
