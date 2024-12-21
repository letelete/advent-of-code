const fs = require('fs');

const CRT_WIDTH = 40;
const SPRITE_RADIUS = 2;

const parse = (source) =>
  source
    .split('\n')
    .filter(Boolean)
    .map((e) => e.split(' '))
    .map(([instr, value]) => [instr, value && Number(value)]);

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const test = parse(fs.readFileSync('test.txt', 'utf-8'));

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

const getPixelSymbol = (cycleValue, pixelIndex) => {
  return Math.abs(cycleValue - (pixelIndex % CRT_WIDTH)) < SPRITE_RADIUS
    ? '⬜️'
    : '⬛️';
};

const part1 = (cpu) => {
  return [20, 60, 100, 140, 180, 220]
    .map((cycleIndex) => cycleIndex * cpu.getNthCycleValue(cycleIndex))
    .reduce((a, b) => a + b);
};

const part2 = (cpu) => {
  return cpu
    .getAllCycleValues()
    .map(getPixelSymbol)
    .map((symbol, i) => (i > 0 && i % CRT_WIDTH === 0 ? `\n${symbol}` : symbol))
    .join('');
};

const run = (data) => {
  const cpu = new CPU();
  data.forEach(([command, value]) => cpu.runTask(command, value));

  console.log(part1(cpu));
  console.log(part2(cpu));
};

run(test);
run(data);
