const fs = require('fs');

const parse = (source) => source;

const data = parse(fs.readFileSync('in.txt', 'utf-8'));

const solve_ = (data, window) => {
  for (let i = window; i <= data.length; ++i) {
    const str = data.slice(i - window, i);
    const set = new Set(str);
    if (set.size === window) return i;
  }
  return -1;
};

// It's cool O(N) and all, but...
// Why was it a first thing that came to my mind at the 6am
// instead of the one above :|
// rip leaderboard
const solve = (data, window) => {
  let l = (r = 0);
  const lastIndexOf = {};
  while (r < data.length) {
    const rLastIndex = lastIndexOf[data[r]];
    lastIndexOf[data[r]] = r;
    if (rLastIndex >= l) {
      l = rLastIndex + 1;
      if (l > r) r = l;
      continue;
    }
    if (r - l + 1 === window) return r + 1;
    r++;
  }
  return -1;
};

console.log(solve(data, 4));
console.log(solve(data, 14));
