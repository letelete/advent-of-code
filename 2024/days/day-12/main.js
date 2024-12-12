function parse(source) {
  return source.trim().split('\n');
}

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

function dfs(data, row, col, visited, isMoveAllowed, onMove) {
  onMove(data, row, col, visited);
  visited.add(`${row},${col}`);
  dirs.orthogonal.forEach(([dx, dy]) => {
    const [nextRow, nextCol] = [row + dx, col + dy];
    if (
      !visited.has(`${nextRow},${nextCol}`) &&
      inRange(data, nextRow, nextCol) &&
      isMoveAllowed(data, nextRow, nextCol, visited)
    ) {
      dfs(data, nextRow, nextCol, visited, isMoveAllowed, onMove);
    }
  });
}

function measure(data, row, col, visited) {
  const regionId = data[row][col];
  let perimeter = 0;
  let region = 0;
  const dirToFences = new Map();

  dfs(
    data,
    row,
    col,
    visited,
    (data, row, col) => data[row][col] === regionId,
    (data, row, col, visited) => {
      if (visited.has(`${row},${col}`)) {
        return;
      }
      if (data[row][col] === regionId) {
        region++;
      }
      dirs.orthogonal.forEach(([dx, dy]) => {
        if (data[row + dx]?.[col + dy] !== regionId) {
          perimeter++;

          const dirHash = `${dx},${dy}`;
          if (!dirToFences.has(dirHash)) {
            dirToFences.set(dirHash, []);
          }
          dirToFences.get(dirHash).push([row + dx, col + dy]);
        }
      });
    }
  );

  const sides = [...dirToFences.entries()].reduce((sides, [hash, fences]) => {
    const affectsRow = !hash.startsWith('0,');
    let localSides = 1;

    const sorted = [...fences].sort(([r1, c1], [r2, c2]) => {
      if (affectsRow) {
        return r1 === r2 ? c1 - c2 : r1 - r2;
      }
      return c1 === c2 ? r1 - r2 : c1 - c2;
    });

    for (let i = 1; i < sorted.length; ++i) {
      const [formerFence, laterFence] = [sorted[i - 1], sorted[i]];
      if (
        laterFence[affectsRow ? 0 : 1] !== formerFence[affectsRow ? 0 : 1] ||
        laterFence[affectsRow ? 1 : 0] - formerFence[affectsRow ? 1 : 0] > 1
      ) {
        localSides++;
      }
    }

    return sides + localSides;
  }, 0);

  return {
    perimeter,
    region,
    sides,
  };
}

const calculateCost = (data) => {
  const visited = new Set();
  let cost = 0;
  let bulkDiscountCost = 0;

  for (let row = 0; row < data.length; ++row) {
    for (let col = 0; col < data[0].length; ++col) {
      const { region, perimeter, sides } = measure(data, row, col, visited);
      cost += region * perimeter;
      bulkDiscountCost += region * sides;
    }
  }

  return { cost, bulkDiscountCost };
};

function part1(data) {
  return calculateCost(data).cost;
}

function part2(data) {
  return calculateCost(data).bulkDiscountCost;
}

module.exports = { parse, part1, part2 };
