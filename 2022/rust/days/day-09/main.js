const fs = require('fs');

class Line {
  constructor(bodySize, startAt = [0, 0]) {
    this.body = new Array(bodySize).fill(startAt);

    this.visited = new Set();

    this._stepsDirs = {
      L: [-1, 0],
      R: [1, 0],
      U: [0, -1],
      D: [0, 1],
    };

    this._markTailVisited();
  }
  move(step) {
    this.body[0] = this._vectorsSum(this._stepsDirs[step], this.body[0]);

    for (let i = 1; i < this.body.length; ++i) {
      if (this._areTouching(this.body[i - 1], this.body[i])) break;

      const diff = this._vectorsDiff(this.body[i - 1], this.body[i]);
      const vMove = this._vectorMin(this._vectorMax(diff, 1), -1);
      this.body[i] = this._vectorsSum(this.body[i], vMove);
    }

    this._markTailVisited();
  }
  _areTouching(a, b) {
    const [x, y] = this._vectorsDiff(a, b).map(Math.abs);
    return x <= 1 && y <= 1;
  }
  _markTailVisited() {
    this.visited.add(this.body.slice(-1)[0].toString());
  }
  _vectorsDiff(a, b) {
    const bOpposite = b.map((bi) => bi * -1);
    return this._vectorsSum(a, bOpposite);
  }
  _vectorsSum(a, b) {
    return a.map((ai, i) => ai + b[i]);
  }
  _vectorMax(a, componentMax) {
    return a.map((ai) => Math.min(componentMax, ai));
  }
  _vectorMin(a, componentMin) {
    return a.map((ai) => Math.max(componentMin, ai));
  }
}

const parse = (source) =>
  source
    .split('\n')
    .filter(Boolean)
    .map((e) => e.split(' '))
    .map(([x, y]) => [x, Number(y)])
    .flatMap(([step, repeat]) => new Array(repeat).fill(step));

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const test = parse(`R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2`);

async () => {
  await visualize(test, 10);

  console.log('--- tests ---');
  solve(test, 2);
  solve(test, 10);
  console.log('--- answers ---');
  solve(data, 2);
  solve(data, 10);
};

function solve(data, lineSize) {
  const line = new Line(lineSize);
  data.forEach((step) => line.move(step));
  console.log(line.visited.size);
}

async function visualize(data, lineSize, delay = 100) {
  const line = new Line(lineSize);
  for (const step of data) {
    console.clear();
    line.move(step);
    print(line.body);
    await new Promise((r) => setTimeout(r, delay));
  }
}

function print(body) {
  const allBodyX = body.map(([x]) => x);
  const allBodyY = body.map(([_, y]) => y);

  const shiftX = -1 * Math.min(...allBodyX);
  const shiftY = -1 * Math.min(...allBodyY);
  const sizeX = Math.max(...allBodyX) + shiftX + 1;
  const sizeY = Math.max(...allBodyY) + shiftY + 1;

  const shiftedBody = body.map(([x, y]) => [x + shiftX, y + shiftY]);

  const canvas = drawCanvas(shiftedBody, sizeX, sizeY);
  console.log(canvas);
}

function drawCanvas(body, sizeX, sizeY) {
  let canvas = '';

  const kSymbol = (k) => (k === 0 ? 'H' : k.toString());

  const addToGrid = (k) => {
    canvas += kSymbol(k);
  };

  for (let i = 0; i < sizeY; ++i) {
    for (let j = 0; j < sizeX; ++j) {
      let noBodyPartDrew = true;
      for (let k = 0; k < body.length; ++k) {
        const [bodyX, bodyY] = body[k];
        if (j === bodyX && i === bodyY) {
          addToGrid(k);
          noBodyPartDrew = false;
          break;
        }
      }
      if (noBodyPartDrew) canvas += '.';
    }
    canvas += '\n';
  }

  return canvas;
}
