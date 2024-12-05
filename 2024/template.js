const fs = require("fs");

function parse(source) {
  return source.trim().split("\n");
}

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

Array.prototype.equals = function (arr) {
  return (
    this.length === arr.length && this.every((e, i) => Object.is(e, arr[i]))
  );
};

function part1(data) {}

function part2(data) {}

/* -------------------------------------------------------------------------------------------------
 * Read Input & Print Output boilerplate
 * -----------------------------------------------------------------------------------------------*/

function withInput(callback) {
  const [data, ...samples] = fs
    .readdirSync(".", { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.match(/^in(\.sample(.*)?)?\.txt$/))
    .sort((file) => (Boolean(file.name.match(/\.sample/)) ? 1 : -1))
    .map((file) => parse(fs.readFileSync(file.name, "utf-8")));

  return callback(data, samples);
}

withInput((data, samples) => {
  const color = {
    primary: "\x1b[97m",
    secondary: "\x1b[90m",
    accent: "\x1b[35m",
    reset: "\x1b[0m",
  };
  const component = {
    heading: (str, colorCode = color.primary) =>
      `${colorCode}=== ${str.toUpperCase()} ===${color.reset}`,
    subheading: (str, colorCode = color.secondary) =>
      `${colorCode}--- ${str.toUpperCase()} ---${color.reset}`,
  };
  const print = {
    section: (heading, data, ans1, ans2) => {
      console.log(component.heading(heading, color.accent));
      console.dir(data, { maxArrayLength: 5, depth: null });
      console.log(component.subheading("part 1"));
      console.log(ans1);
      console.log(component.subheading("part 2"));
      console.log(ans2);
    },
  };
  samples.forEach((sample, index) =>
    print.section(`sample ${index + 1}`, sample, part1(sample), part2(sample))
  );
  print.section(`answer`, data, part1(data), part2(data));
});
