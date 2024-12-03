import { Comp } from './solution.utils';

type Data = [left: number, right: number][];

function parse(source: string): Data {
  return source
    .split('\n')
    .filter(Boolean)
    .map((line) => [...line.matchAll(/(\d+)/g)])
    .map((matches) => matches.map((match) => Number(match[1])))
    .map(([left, right]) => {
      if (left === undefined || right === undefined) {
        throw new Error(
          `Expected both values to be present, but got: ${{ left, right }}`
        );
      }
      return [left, right];
    });
}

function partOne(data: Data) {
  const left = data.map(([lvalue]) => lvalue).sort(Comp.num.asc);
  const right = data.map(([_, rvalue]) => rvalue).sort(Comp.num.asc);

  const distances = left.map((lvalue, i) => {
    if (right[i] === undefined) {
      throw new Error(`Index out of bounds when reading right[${i}]`);
    }
    return Math.abs(right[i] - lvalue);
  });

  return distances.sum();
}

function partTwo(data: Data) {
  const left = data.map(([lvalue]) => lvalue);
  const right = data.map(([_, rvalue]) => rvalue);

  const occurrences = right.reduce((acc, rvalue) => {
    acc.set(rvalue, (acc.get(rvalue) ?? 0) + 1);
    return acc;
  }, new Map());

  const similarityScores = left.map(
    (lvalue) => lvalue * (occurrences.get(lvalue) ?? 0)
  );

  return similarityScores.sum();
}

export type { Data };
export { parse, partOne, partTwo };
