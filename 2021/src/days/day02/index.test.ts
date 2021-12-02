import { Coords, CoordsWithAim, Data, Entry } from './_types';
import { DayProps, Input } from '../../shared/types';
import {
  applyMoves,
  applyMovesWithAim,
  runInstructions,
  taskStates,
} from './_solution';

import day from './index';
import { parse } from './_parse';
import readInput from '../../utils/readInput';

const firstSample = 'forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2';

describe('Parse', () => {
  const input = 'forward 5\ndown 5\nup 3';

  it('Should parse basic input', () => {
    const expected = [
      { instruction: 'forward', value: 5 },
      { instruction: 'down', value: 5 },
      { instruction: 'up', value: 3 },
    ];
    expect(parse(input)).toEqual(expected);
  });
});

describe('Run instructions', () => {
  it('should run simple instructions', () => {
    const data = [
      { instruction: 'down', value: 1 },
      { instruction: 'forward', value: 1 },
      { instruction: 'up', value: 2 },
      { instruction: 'forward', value: 10 },
    ] as Data;
    expect(runInstructions(data, taskStates)).toEqual([
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -2 },
      { x: 10, y: 0 },
    ]);
  });
});

describe('Apply moves', () => {
  it('should run simulation', () => {
    const data = [
      { instruction: 'down', value: 1 },
      { instruction: 'forward', value: 1 },
      { instruction: 'down', value: 1 },
      { instruction: 'down', value: 2 },
      { instruction: 'down', value: 4 },
      { instruction: 'forward', value: 2 },
      { instruction: 'forward', value: 4 },
      { instruction: 'up', value: 2 },
      { instruction: 'down', value: 2 },
      { instruction: 'forward', value: 1000 },
      { instruction: 'down', value: 2 },
    ] as Data;
    const moves = runInstructions(data, taskStates);
    const startingPoint = {
      x: 0,
      y: 0,
    } as Coords;
    expect(applyMoves(startingPoint, moves)).toEqual({
      x: 1007,
      y: 10,
    });
  });
});

describe('Apply moves with aim', () => {
  it('should run simulation', () => {
    const data = parse(firstSample);
    const moves = runInstructions(data, taskStates);
    const startingPoint = {
      x: 0,
      y: 0,
      aim: 0,
    } as CoordsWithAim;
    expect(applyMovesWithAim(startingPoint, moves)).toEqual({
      x: 15,
      y: 60,
      aim: 10,
    });
  });
});

describe('First sample', () => {
  const input = firstSample as Input;
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('150');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('900');
  });
});

describe('Final sample', () => {
  const input = readInput(2);
  const {
    parts: [partOne, partTwo],
  } = day({ input });

  it('Part one', () => {
    expect(partOne()).toEqual('1635930');
  });

  it('Part two', () => {
    expect(partTwo()).toEqual('1781819478');
  });
});
