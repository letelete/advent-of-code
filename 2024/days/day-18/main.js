function parse(source) {
  const bytes = source
    .match(/(\d+)/g)
    .map(Number)
    .reduce((acc, _, i, arr) => {
      if (i % 2 === 0) {
        acc.push([arr[i + 1], arr[i]]);
      }
      return acc;
    }, []);

  const size = Math.max(...bytes.flat()) + 1;
  const start = [0, 0];
  const end = [size - 1, size - 1];

  return { bytes, size, start, end };
}

const dirs = {
  orthogonal: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
};

function hash(row, col) {
  return `${row},${col}`;
}

function inRange(size, row, col) {
  return row >= 0 && row < size && col >= 0 && col < size;
}

const findShortestPath = (size, obstacles, start, end) => {
  const visited = new Set();
  const distance = new Map();
  distance.set(hash(start[0], start[1]), 0);

  const q = [[0, ...start]];

  while (q.length) {
    q.sort(([acost], [bcost]) => bcost - acost);

    const [cost, row, col] = q.pop();
    visited.add(hash(row, col));

    if (row === end[0] && col === end[1]) {
      break;
    }

    dirs.orthogonal.forEach(([drow, dcol]) => {
      const nextRow = row + drow;
      const nextCol = col + dcol;
      const nextHash = hash(nextRow, nextCol);
      if (
        inRange(size, nextRow, nextCol) &&
        !obstacles.has(nextHash) &&
        !visited.has(nextHash)
      ) {
        const nextCost = cost + 1;
        if (!distance.has(nextHash) || nextCost < distance.get(nextHash)) {
          distance.set(nextHash, nextCost);
          q.push([nextCost, nextRow, nextCol]);
        }
      }
    });
  }
  return distance.get(hash(end[0], end[1]));
};

function buildPathFinder(size, bytes, start, end) {
  const hashedBytes = bytes.map(([row, col]) => hash(row, col));
  return (n) => {
    return findShortestPath(size, new Set(hashedBytes.slice(0, n)), start, end);
  };
}

function findFirstByteToBlockExit(size, bytes, start, end) {
  const getShortestPath = buildPathFinder(size, bytes, start, end);
  let index = -1;

  for (let l = 0, r = bytes.length - 1, mid; l <= r; ) {
    mid = l + Math.floor((r - l) / 2);
    if (getShortestPath(mid) === undefined) {
      r = mid - 1;
    } else {
      l = mid + 1;
      index = Math.max(index, mid);
    }
  }

  return index;
}

function part1(data) {
  return buildPathFinder(data.size, data.bytes, data.start, data.end)(1024);
}

function part2(data) {
  const byteIndex = findFirstByteToBlockExit(
    data.size,
    data.bytes,
    data.start,
    data.end
  );

  if (byteIndex === -1) {
    throw new Error('No byte blocks the exit');
  }

  return [...data.bytes[byteIndex]].reverse().join(',');
}

module.exports = { parse, part1, part2 };
