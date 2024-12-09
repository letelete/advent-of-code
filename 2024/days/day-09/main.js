function parse(source) {
  return source.trim().split('').map(Number);
}

function part1(data) {
  const id = (index) => Math.floor(index / 2);
  const isFile = (index) => index % 2 === 0;
  const q = [];
  let arr = [...data];
  let r = arr.length - 1;

  let offset = 0;

  for (let l = 0; l <= r; l++) {
    if (isFile(l)) {
      if (arr[l]) {
        q.push({ len: arr[l], id: id(l), offset });
        offset += arr[l];
      }
    } else {
      let free = arr[l];
      while (free > 0 && r > l) {
        if (isFile(r)) {
          const take = Math.min(free, arr[r]);
          q.push({ len: take, id: id(r), offset });

          offset += take;
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

  return q.reduce((checksum, block) => {
    for (let i = 0; i < block.len; ++i) {
      checksum += block.id * (block.offset + i);
    }
    return checksum;
  }, 0);
}

function part2(data) {
  const id = (index) => Math.floor(index / 2);
  const isFile = (index) => index % 2 === 0;
  const queue = [];
  for (
    let arr = [...data], l = 0, r = arr.length - 1, offset = 0;
    l <= r;
    l++
  ) {
    if (arr[l] === 0) {
      offset += data[l];
      continue;
    }

    if (isFile(l)) {
      if (arr[l]) {
        queue.push({ len: arr[l], id: id(l), offset });
        offset += arr[l];
      }
    } else {
      let free = arr[l];
      let virtualr = r;
      while (free > 0 && virtualr > l) {
        if (isFile(virtualr)) {
          if (arr[virtualr] === 0 && r === virtualr) {
            r--;
            virtualr--;
            continue;
          }
          if (arr[virtualr] > free || arr[virtualr] === 0) {
            virtualr--;
            continue;
          }

          queue.push({ len: arr[virtualr], id: id(virtualr), offset });

          offset += arr[virtualr];
          free -= arr[virtualr];
          arr[virtualr] = 0;
        } else {
          virtualr--;
        }
      }
      offset += free;
    }
  }

  return queue.reduce((checksum, block) => {
    for (let i = 0; i < block.len; ++i) {
      checksum += block.id * (block.offset + i);
    }
    return checksum;
  }, 0);
}

module.exports = { parse, part1, part2 };
