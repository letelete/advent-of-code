function parse(source) {
  return source
    .trim()
    .split('\n')
    .map((line) => line.split('').map(Number));
}

const TOP_HEIGHT = 9;

const dirs = {
  orthogonal: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
};

function getHeads(data) {
  const pos = [];
  for (let row = 0; row < data.length; ++row) {
    for (let col = 0; col < data[0].length; ++col) {
      if (data[row][col] === 0) {
        pos.push([row, col]);
      }
    }
  }
  return pos;
}

function inRange(data, row, col) {
  return row >= 0 && row < data.length && col >= 0 && col < data[0].length;
}

function countReachable(data, startRow, startCol) {
  const dfs = (data, row, col, visited) => {
    if (data[row][col] === TOP_HEIGHT) {
      return 1;
    }

    return dirs.orthogonal
      .map(([dx, dy]) => [row + dx, col + dy])
      .filter(
        ([nextRow, nextCol]) =>
          !visited.has(`${nextRow},${nextCol}`) &&
          inRange(data, nextRow, nextCol) &&
          data[nextRow][nextCol] === data[row][col] + 1
      )
      .reduce((count, [nextRow, nextCol]) => {
        visited.add(`${nextRow},${nextCol}`);
        return count + dfs(data, nextRow, nextCol, visited);
      }, 0);
  };

  return dfs(data, startRow, startCol, new Set([`${startRow},${startCol}`]));
}

function countUniquePaths(data, row, col, dp) {
  if (data[row][col] === TOP_HEIGHT) {
    dp[row][col] = 1;
  }
  if (dp[row][col] !== null) {
    return dp[row][col];
  }

  dp[row][col] = dirs.orthogonal
    .map(([dx, dy]) => [row + dx, col + dy])
    .filter(
      ([nextRow, nextCol]) =>
        inRange(data, nextRow, nextCol) &&
        data[nextRow][nextCol] === data[row][col] + 1
    )
    .reduce(
      (count, [nextRow, nextCol]) =>
        count + countUniquePaths(data, nextRow, nextCol, dp),
      0
    );

  return dp[row][col];
}

function part1(data) {
  const heads = getHeads(data);

  return heads.reduce(
    (count, [row, col]) => count + countReachable(data, row, col),
    0
  );
}

function part2(data) {
  const heads = getHeads(data);
  const dp = data.map((row) => row.map(() => null));
  const t = heads.reduce(
    (count, [row, col]) => count + countUniquePaths(data, row, col, dp),
    0
  );
  return t;
}

module.exports = { parse, part1, part2 };
