import fs from "fs";
import YAML from "yaml";
import * as solution from "./solution";

interface FileSampleEntry {
  name: string;
  in: string;
  out: string;
  part: number;
}

interface Sample {
  name: string;
  data: solution.Data;
  expected: number;
  runner: (data: solution.Data) => number;
  part: number;
}

const file = fs.readFileSync("data/in.samples.yml", "utf-8");
const samples = YAML.parseAllDocuments(file)
  .map(({ contents }) => contents?.toJSON() as FileSampleEntry)
  .map(
    (entry) =>
      ({
        name: entry.name,
        data: solution.parse(entry.in),
        expected: Number(entry.out),
        part: Number(entry.part),
        runner: entry.part === 1 ? solution.partOne : solution.partTwo,
      } satisfies Sample)
  );

samples.forEach((sample) => {
  test(`[Part ${sample.part}] ${sample.name}`, () => {
    expect(sample.runner(sample.data)).toBe(sample.expected);
  });
});
