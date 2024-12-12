function parse(source) {
  return source.trim().split('\n');
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

const dirs = {
  orthogonal: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
};

function inRange(data, row, col) {
  return row >= 0 && row < data.length && col >= 0 && col < data[0].length;
}

const dfs = (data, row, col, visited, isMoveAllowed, onMove) => {
  onMove(data, row, col, visited);
  visited.add(`${row},${col}`);
  dirs.orthogonal
    .map(([dx, dy]) => [row + dx, col + dy])
    .filter(
      ([nextRow, nextCol]) =>
        !visited.has(`${nextRow},${nextCol}`) &&
        inRange(data, nextRow, nextCol) &&
        isMoveAllowed(data, nextRow, nextCol, visited)
    )
    .forEach(([nextRow, nextCol]) => {
      dfs(data, nextRow, nextCol, visited, isMoveAllowed, onMove);
    }, 0);
};

function measure(data, row, col, visited) {
  const regionId = data[row][col];
  let perimeter = 0;
  let region = 0;
  dfs(
    data,
    row,
    col,
    visited,
    (data, r, c) => data[r][c] === regionId,
    (data, r, c, visited) => {
      if (visited.has(`${r},${c}`)) {
        return;
      }
      if (data[r][c] === regionId) {
        region++;
      }
      const p = dirs.orthogonal.reduce((acc, [dx, dy]) => {
        if (data[r + dx]?.[c + dy] !== regionId) {
          acc++;
        }
        return acc;
      }, 0);
      console.log('measure:', {
        r,
        c,
        val: data[r][c],
        region,
        p,
      });

      perimeter += p;
    }
  );
  console.log('--end--');
  return { perimeter, region };
}

function measure2(data, row, col, visited) {
  const regionId = data[row][col];
  let perimeter = 0;
  let region = 0;
  const sides = new Map();
  dfs(
    data,
    row,
    col,
    visited,
    (data, r, c) => data[r][c] === regionId,
    (data, r, c, visited) => {
      if (visited.has(`${r},${c}`)) {
        return;
      }
      if (data[r][c] === regionId) {
        region++;
      }
      const p = dirs.orthogonal.reduce((acc, [dx, dy]) => {
        if (data[r + dx]?.[c + dy] !== regionId) {
          acc++;
          sides.set(`${dx},${dy}`, [
            ...(sides.get(`${dx},${dy}`) ?? []),
            [r + dx, c + dy],
          ]);
        }
        return acc;
      }, 0);

      perimeter += p;
    }
  );
  const sortedSides = [...sides.entries()].map(([key, side]) => {
    const affectsRow = key.split(',')[0] !== '0';
    side.sort(([r1, c1], [r2, c2]) => {
      if (affectsRow) {
        if (r1 === r2) {
          return c1 - c2;
        }
        return r1 - r2;
      }
      if (c1 === c2) {
        return r1 - r2;
      }
      return c1 - c2;
    });
    return [key, side];
  });

  const bulkSides = sortedSides.map(([key, side]) => {
    let sides = 1;
    const affectsRow = key.split(',')[0] !== '0';
    for (let i = 1; i < side.length; ++i) {
      if (affectsRow) {
        if (
          side[i][0] !== side[i - 1][0] ||
          Math.abs(side[i][1] - side[i - 1][1]) > 1
        ) {
          sides++;
        }
      } else {
        if (
          side[i][1] !== side[i - 1][1] ||
          Math.abs(side[i][0] - side[i - 1][0]) > 1
        ) {
          sides++;
        }
      }
    }
    return [key, sides];
  });

  sortedSides.forEach(([key, sides]) =>
    console.log('sorted', { key, v: data[row][col], sides }, sides.length)
  );
  bulkSides.forEach(([key, sides]) =>
    console.log('bulk', { key, v: data[row][col], sides })
  );
  return {
    perimeter,
    region,
    sides: bulkSides.reduce((acc, [, side]) => acc + side, 0),
  };
}

function part1(data) {
  // const visited = new Set();
  // let cost = 0;
  // for (let row = 0; row < data.length; ++row) {
  //   for (let col = 0; col < data[0].length; ++col) {
  //     const { region, perimeter } = measure(data, row, col, visited);
  //     console.log({ row, col, val: data[row][col], region, perimeter });
  //     cost += region * perimeter;
  //   }
  // }
  // return cost;
}

function part2(data) {
  const visited = new Set();
  let cost = 0;
  for (let row = 0; row < data.length; ++row) {
    for (let col = 0; col < data[0].length; ++col) {
      const { region, perimeter, sides } = measure2(data, row, col, visited);
      if (region) {
        console.log({
          row,
          col,
          val: data[row][col],
          region,
          perimeter,
          sides,
        });
        cost += region * sides;
      }
    }
  }
  return cost;
}

module.exports = { parse, part1, part2 };
