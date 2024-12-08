function parse(source) {
  return source.trim().split("\n");
}

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

Array.prototype.equals = function (arr) {
  return (
    this.length === arr.length && this.every((e, i) => Object.is(e, arr[i]))
  );
};

function part1(data) {}

function part2(data) {}

module.exports = { parse, part1, part2 };
