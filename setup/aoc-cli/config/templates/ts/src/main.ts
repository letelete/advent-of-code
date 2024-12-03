import fs from "fs";
import minimist from "minimist";
import { parse, partOne, partTwo } from "./solution";

const argv = minimist<{ verbose: boolean }>(process.argv.slice(2), {
  boolean: ["verbose"],
  alias: {
    v: "verbose",
  },
  default: {
    verbose: false,
  },
});

interface SolveOptions {
  verbose: boolean;
}

function solve(options: SolveOptions) {
  const data = parse(fs.readFileSync("data/in.txt", "utf-8"));

  const partOneAnswer = partOne(data);
  const partTwoAnswer = partTwo(data);

  if (options.verbose) {
    console.log("\x1b[31m--- DATA---\x1b[0m\n", data);
    console.log();
    console.log("\x1b[31m--- PART ONE ---\x1b[0m\n", partOneAnswer);
    console.log("\x1b[31m--- PART TWO ---\x1b[0m\n", partTwoAnswer);
  } else {
    console.log(partOneAnswer);
    console.log(partTwoAnswer);
  }
}

solve({ verbose: argv.verbose });
