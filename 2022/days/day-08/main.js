const fs = require('fs');

const parse = (source) =>
  source
    .split('\n')
    .filter(Boolean)
    .map((e) => e.split(''))
    .map((e) => e.map((x) => Number(x)));

const data = parse(fs.readFileSync('in.txt', 'utf-8'));

const test = parse(`30373
25512
65332
33549
35390`);

console.log(test);

const sliceLTRB = (i, j, data) => {
  return [
    data[i].slice(0, j).reverse(),
    data.slice(0, i).map((e) => e[j]).reverse(),
    data[i].slice(j + 1, data[i].length),
    data.slice(i + 1, data.length).map((e) => e[j]),
  ];
};

const isVisible = (i, j, data) => {
  return sliceLTRB(i, j, data)
    .map((slice) => Math.max(...slice))
    .some((max) => max < data[i][j]);
};

const scenicScore = (i, j, data) => {
  return sliceLTRB(i, j, data)
    .map((slice) => [slice, slice.findIndex((tree) => tree >= data[i][j])])
    .map(([slice, findex]) => findex === -1 ? slice.length : findex + 1)
    .reduce((a, b) => a * b);
};

const traverse = (data, fn) => {
  for (let i = 1; i < data.length - 1; ++i) {
    for (let j = 1; j < data[i].length - 1; ++j) {
      fn(i, j);
    }
  }
};

const getVisibleCount = (data) => {
  let visible = data.length * 2 + (data[0].length - 2) * 2;
  traverse(data, (i, j) => { visible += isVisible(i, j, data) });
  return visible;
};

const getBestScenicScore = (data) => {
  let best = 0;
  traverse(data, (i, j) => {
    best = Math.max(scenicScore(i, j, data), best);
  });
  return best;
};

console.log(getVisibleCount(data));
console.log(getBestScenicScore(data));
