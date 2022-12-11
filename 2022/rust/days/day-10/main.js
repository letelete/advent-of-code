const fs = require('fs');

const CRT_WIDTH = 40;
const CRT_HEIGHT = 6;
const SPRITE_RADIUS = 2;

const parse = (source) =>
  source
    .split('\n')
    .filter(Boolean)
    .map((e) => e.split(' '))
    .map(([instr, value]) => [instr, value && Number(value)]);

const data = parse(fs.readFileSync('in.txt', 'utf-8'));

const test = parse(`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`);

class CPU {
  constructor() {
    this._cycleValues = [1];
    this._inputParser = {
      addx: (inputValue) => {
        this._repeatLastCycle();
        this._addCycleValue(this._calculateCycleValue(inputValue));
      },
      noop: () => this._repeatLastCycle(),
    };
  }
  runTask(command, value) {
    this._inputParser[command](value);
  }
  getNthCycleValue(n) {
    return this._cycleValues[n - 1];
  }
  getAllCycleValues() {
    return this._cycleValues;
  }
  _addCycleValue(calculatedCycleValue) {
    this._cycleValues.push(calculatedCycleValue);
  }
  _calculateCycleValue(inputValue) {
    return this._getLastCycle() + inputValue;
  }
  _repeatLastCycle() {
    this._cycleValues.push(this._getLastCycle());
  }
  _getLastCycle() {
    return this._cycleValues[this._cycleValues.length - 1];
  }
}

const part1 = (data) => {
  const cpu = new CPU();

  data.forEach(([command, value]) => cpu.runTask(command, value));

  return [20, 60, 100, 140, 180, 220]
    .map((cycleIndex) => cycleIndex * cpu.getNthCycleValue(cycleIndex))
    .reduce((a, b) => a + b);
};

const part2 = (data) => {
  const cpu = new CPU();

  data.forEach(([command, value]) => cpu.runTask(command, value));
  return cpu
    .getAllCycleValues()
    .map((value, i) => {
      const sym = Math.abs(value - (i % CRT_WIDTH)) < SPRITE_RADIUS ? '⚪️' : '⚫️';
      const newline = i && i % CRT_WIDTH === 0;
      return newline ? `\n${sym}` : sym;
    })
    .join('');
};

console.log(part1(test));
console.log(part2(data));
