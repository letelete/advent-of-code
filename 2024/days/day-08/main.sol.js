function parse(source) {
  return source.trim().split("\n");
}

function part1(data) {
  const antinodes = new Set();

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

  [...nodesPos.entries()].forEach(([node, allPos]) => {
    const pairs = [];
    for (let i = 0; i < allPos.length; ++i) {
      for (let j = i + 1; j < allPos.length; ++j) {
        pairs.push([allPos[i], allPos[j]]);
      }
    }

    pairs.forEach(([[row, col], [lookupRow, lookupCol]]) => {
      const a1Row = row + (row - lookupRow);
      const a1Col = col + (col - lookupCol);

      const a2Row = lookupRow + (lookupRow - row);
      const a2Col = lookupCol + (lookupCol - col);

      if (data[a1Row]?.[a1Col] !== undefined) {
        antinodes.add(`${a1Row},${a1Col}`);
      }
      if (data[a2Row]?.[a2Col] !== undefined) {
        antinodes.add(`${a2Row},${a2Col}`);
      }
    });
  });

  return antinodes.size;
}

function part2(data) {
  const antinodes = new Set();

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

  [...nodesPos.values()].forEach((allPos) => {
    const pairs = [];
    for (let i = 0; i < allPos.length; ++i) {
      for (let j = i + 1; j < allPos.length; ++j) {
        pairs.push([allPos[i], allPos[j]]);
      }
    }

    pairs.forEach(([[aRow, aCol], [bRow, bCol]]) => {
      let incr = 1;
      let candidates = [
        [aRow, aCol],
        [bRow, bCol],
      ];
      while (candidates.length) {
        candidates.forEach(([row, col]) => antinodes.add(`${row},${col}`));

        candidates = [
          [aRow + (aRow - bRow) * incr, aCol + (aCol - bCol) * incr],
          [bRow + (bRow - aRow) * incr, bCol + (bCol - aCol) * incr],
        ].filter(
          ([row, col]) =>
            row >= 0 && row < data.length && col >= 0 && col < data[0].length
        );

        incr++;
      }
    });
  });

  const color = {
    accent: "\x1b[35m",
    reset: "\x1b[0m",
  };

  [...antinodes]
    .reduce(
      (grid, a) => {
        const [row, col] = a.split(",").map(Number);
        const temp = grid[row].split("");
        temp[col] =
          grid[row][col] === "."
            ? "#"
            : `${color.accent}${grid[row][col]}${color.reset}`;
        grid[row] = temp.join("");
        return grid;
      },
      [...data.map((row) => row)]
    )
    .forEach((line) => console.log(line));

  console.log(nodesPos);

  return antinodes.size;
}

module.exports = { parse, part1, part2 };
