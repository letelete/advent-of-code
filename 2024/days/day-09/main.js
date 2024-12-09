function parse(source) {
  return source.trim();
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

function part1(data) {
  // 11332321109
  // 0.111...22...33.4555555555
  // 051115552255533545
  // 051115552255533455

  const arr = data.split('').map(Number);

  const id = (index) => Math.floor(index / 2);
  const isFile = (index) => index % 2 === 0;

  const q = [];

  for (let l = 0, lvirtual = 0, r = arr.length - 1; l <= r; l++) {
    if (isFile(l)) {
      if (arr[l] > 0) {
        q.push({ len: arr[l], id: id(l) });
        lvirtual += arr[l];
      }
    } else {
      let free = arr[l];
      while (free > 0 && r >= lvirtual) {
        if (isFile(r)) {
          const take = Math.min(free, arr[r]);
          q.push({ len: take, id: id(r) });

          lvirtual += take;
          free -= take;
          arr[r] -= take;

          if (arr[r] === 0) {
            r--;
          }
        } else {
          r--;
        }
      }
    }
  }

  console.log({ q });

  return checksum;
}

function part2(data) {
  return null;
}

module.exports = { parse, part1, part2 };
