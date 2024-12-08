function parse(source) {
  return source.trim().split("\n");
}

function getAntennaPositions(data) {
  const nodesPos = new Map();
  for (let row = 0; row < data.length; ++row) {
    for (let col = 0; col < data[0].length; ++col) {
      if (data[row][col] !== ".") {
        nodesPos.set(data[row][col], [
          ...(nodesPos.get(data[row][col]) ?? []),
          [row, col],
        ]);
      }
    }
  }
  return nodesPos;
}

function generatePairs(positions) {
  const pairs = [];
  for (let i = 0; i < positions.length; ++i) {
    for (let j = i + 1; j < positions.length; ++j) {
      pairs.push([positions[i], positions[j]]);
    }
  }
  return pairs;
}

function inRange(data, row, col) {
  return row >= 0 && row < data.length && col >= 0 && col < data[0].length;
}

function part1(data) {
  const antinodes = new Set();

  getAntennaPositions(data).forEach((allPos) =>
    generatePairs(allPos).forEach(([a, b]) => {
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      [
        [a[0] + dx, a[1] + dy],
        [b[0] - dx, b[1] - dy],
      ].forEach(([row, col]) => {
        if (inRange(data, row, col)) {
          antinodes.add(`${row},${col}`);
        }
      });
    })
  );

  return antinodes.size;
}

function part2(data) {
  const antinodes = new Set();

  getAntennaPositions(data).forEach((allPos) =>
    generatePairs(allPos).forEach((pair) => {
      let a = [...pair[0]];
      let b = [...pair[1]];
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      while (inRange(data, a[0], a[1])) {
        antinodes.add(`${a[0]},${a[1]}`);
        a[0] += dx;
        a[1] += dy;
      }
      while (inRange(data, b[0], b[1])) {
        antinodes.add(`${b[0]},${b[1]}`);
        b[0] -= dx;
        b[1] -= dy;
      }
    })
  );

  return antinodes.size;
}

module.exports = { parse, part1, part2 };
