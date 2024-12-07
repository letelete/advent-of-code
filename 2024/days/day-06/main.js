const fs = require("fs");
const os = require("os");
const { Console } = require("console");
const { Transform } = require("stream");
const { parse, part1, part2 } = require("./main.sol");

function noop() {}

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
  table(input) {
    const ts = new Transform({
      transform(chunk, enc, cb) {
        cb(null, chunk);
      },
    });
    const logger = new Console({ stdout: ts });
    logger.table(input);
    const table = (ts.read() || "").toString();
    let result = "";
    for (let row of table.split(/[\r\n]+/)) {
      let r = row.replace(/[^┬]*┬/, "┌");
      r = r.replace(/^├─*┼/, "├");
      r = r.replace(/│[^│]*/, "");
      r = r.replace(/^└─*┴/, "└");
      r = r.replace(/'/g, " ");
      result += `${r}\n`;
    }
    return result;
  },
};

function capitalize(val) {
  return val.charAt(0).toUpperCase() + String(val).slice(1);
}

function withMeasure(fn) {
  const t0 = performance.now();
  const result = fn();
  const t1 = performance.now();

  const delta = t1 - t0;

  return { result, delta };
}

function formatDelta(delta) {
  if (delta < 1000) {
    return `${delta.toFixed(2)}ms`;
  }
  return `${(delta / 1000).toFixed(3)}s`;
}

const print = {
  section: (heading, data, solver1, solver2) => {
    const part1 = withMeasure(() => solver1(data));
    const part2 = withMeasure(() => solver2(data));
    const summary = component.table(
      [
        [1, part1.delta],
        [2, part2.delta],
      ].map(([part, delta]) => ({
        part,
        "time (~)": formatDelta(delta),
        μs: delta,
      }))
    );

    console.log(component.heading(heading, color.accent));
    console.dir(data, { maxArrayLength: 5, depth: null });
    console.log(component.subheading("part 1"));
    console.log(part1.result);
    console.log(component.subheading("part 2"));
    console.log(part2.result);

    fs.appendFile(
      "./README.md",
      [
        "",
        `## ${capitalize(heading)}`,
        "",
        "```",
        summary.trim(),
        "```",
        "",
      ].join("\n"),
      noop
    );
  },
};

function getSystemInfo() {
  let info = "";

  info += `Platform: ${os.platform()} ${os.arch()}\n`;

  const cpus = os.cpus();
  const cpu = os.cpus()[0];
  info += `CPU: ${cpus[0].model} @ ${(cpu.speed / 1000).toFixed(2)} GHz, ${
    cpus.length
  } Cores\n`;

  const totalMem = os.totalmem();
  info += `Memory: ${(totalMem / 1024 ** 3).toFixed(2)} GB\n`;

  return info;
}

function withInput(callback) {
  const [data, ...samples] = fs
    .readdirSync(".", { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.match(/^in(\.sample(.*)?)?\.txt$/))
    .sort((file) => (Boolean(file.name.match(/\.sample/)) ? 1 : -1))
    .map((file) => parse(fs.readFileSync(file.name, "utf-8")));

  return callback(data, samples);
}

withInput((data, samples) => {
  fs.writeFile(
    "./README.md",
    ["# Summary", "", "```", getSystemInfo().trim(), "```", ""].join("\n"),
    noop
  );

  samples.forEach((sample, index) =>
    print.section(`sample ${index + 1}`, sample, part1, part2)
  );
  print.section(`answer`, data, part1, part2);
});
