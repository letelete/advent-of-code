/**
 * Runs part1 and part2 based on provided input and samples.
 * Logs data to console, and generates README.md file with benchmark summary.
 *
 * @argument {dayPath}    A relative path to the day the runner executes.
 * @argument {dayTarget}  A filename that the runner imports { parse, part1, part2} from.
 *                        Defaults to `main.js`.
 */
const fs = require('fs');
const os = require('os');

const README_FILENAME = `README.md`;

const args = process.argv.slice(2);
const dayPath = args[0];
const dayTarget = args[1];
const samplesOnly = args.includes('--test');
if (!dayPath) {
  throw new Error('Missing required argument: relative day path');
}
if (!dayTarget) {
  throw new Error('Missing required argument: day target filename');
}

const { parse, part1, part2 } = require(`${dayPath}/${dayTarget}`);

const color = {
  primary: '\x1b[97m',
  secondary: '\x1b[90m',
  accent: '\x1b[35m',
  reset: '\x1b[0m',
};

const component = {
  heading(str, colorCode = color.primary) {
    return `${colorCode}=== ${str.toUpperCase()} ===${color.reset}`;
  },
  subheading(str, colorCode = color.secondary) {
    return `${colorCode}--- ${str.toUpperCase()} ---${color.reset}`;
  },
  capitalized(val) {
    return val.charAt(0).toUpperCase() + String(val).slice(1);
  },
};

const markdown = {
  header(level, children) {
    return `${new Array(level).fill('#').join('')} ${children}`;
  },
  table(headings, rows) {
    const colWidth = headings.map((heading, index) =>
      Math.max(
        heading.length,
        ...rows.map((row) => row[index].toString().length)
      )
    );

    return [
      [
        '|',
        headings
          .map(
            (heading, index) => `${heading.toString().padEnd(colWidth[index])}`
          )
          .join(' | '),
        '|',
      ].join(' '),
      [
        '|',
        colWidth
          .map((width) => new Array(width).fill('-').join(''))
          .join(' | '),
        '|',
      ].join(' '),
      ...rows.map((row) =>
        [
          '|',
          row
            .map((cell, index) => `${cell.toString().padEnd(colWidth[index])}`)
            .join(' | '),
          '|',
        ].join(' ')
      ),
    ].join('\n');
  },
};

const readme = {
  init() {
    fs.writeFileSync(
      `${dayPath}/${README_FILENAME}`,
      [
        markdown.header(1, 'Benchmark'),
        '',
        '```',
        getSystemInfo().trim(),
        '```',
        '',
      ].join('\n')
    );
  },
  appendSection(heading, ans1Delta, ans2Delta) {
    const markdownSection = [
      '',
      markdown.header(2, component.capitalized(heading)),
      '',
      markdown.table(
        ['part', 'time (~)', 'μs'],
        [
          [1, ans1Delta],
          [2, ans2Delta],
        ]
          .filter(([_, delta]) => delta !== undefined)
          .map(([part, delta]) => [part, formatDelta(delta), delta])
      ),
      '',
    ].join('\n');

    fs.appendFileSync(`${dayPath}/${README_FILENAME}`, markdownSection);
  },
};

const print = {
  section(heading, data, ans1, ans2) {
    console.log(component.heading(heading, color.accent));
    console.dir(data, { maxArrayLength: 5, depth: null });
    console.log(component.subheading('part 1'), formatDelta(ans1.delta));
    console.log(ans1.result);
    console.log(component.subheading('part 2'), formatDelta(ans2.delta));
    console.log(ans2.result);
  },
};

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

function getSystemInfo() {
  const cpus = os.cpus();

  return [
    `Platform: ${os.platform()} ${os.arch()}`,
    `CPU: ${cpus[0].model} ${cpus.length} Cores`,
    `Memory: ${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`,
  ].join('\n');
}

function run(heading, data) {
  const ans1 = withMeasure(() => part1(data));
  const ans2 = withMeasure(() => part2(data));

  print.section(heading, data, ans1, ans2);
  if (ans1.result !== null) {
    if (ans2.result !== null) {
      readme.appendSection(heading, ans1.delta, ans2.delta);
    } else {
      readme.appendSection(heading, ans1.delta);
    }
  }
}

function withInput(callback) {
  const [data, ...samples] = fs
    .readdirSync(dayPath, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.match(/^in(\.sample(.*)?)?\.txt$/))
    .sort((a, b) => {
      if (Boolean(a.name.match(/\.sample/))) {
        return Boolean(b.name.match(/\.sample/))
          ? a.name.localeCompare(b.name)
          : 1;
      }
      return -1;
    })
    .map((file) => parse(fs.readFileSync(`${dayPath}/${file.name}`, 'utf-8')));

  return callback(data, samples);
}

withInput((data, samples) => {
  readme.init();

  samples.forEach((sample, index) => run(`sample ${index + 1}`, sample));
  if (!samplesOnly) {
    run('answer', data);
  }
});
