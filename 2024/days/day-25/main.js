function parse(source) {
  return source
    .trim()
    .split('\n\n')
    .map((entity) => {
      const lines = entity.split('\n');
      const type =
        lines[0].match('.') && !lines.at(-1).match('#') ? 'lock' : 'key';
      const heights = [];
      for (let col = 0; col < lines[0].length; ++col) {
        let height = 0;
        for (let row = 1; row < lines.length - 1; ++row) {
          height += lines[row][col] === '#';
        }
        heights.push(height);
      }
      return { type, heights, length: lines.length - 2 };
    })
    .reduce(
      (obj, entity) => {
        (entity.type === 'key' ? obj.keys : obj.locks).push(entity);
        return obj;
      },
      { keys: [], locks: [] }
    );
}

function checkIfFits(key, lock) {
  return key.heights.every(
    (height, i) => key.length >= height + lock.heights[i]
  );
}

function part1(data) {
  const { keys, locks } = data;
  let fits = 0;
  keys.forEach((key) =>
    locks.forEach((lock) => (fits += checkIfFits(key, lock)))
  );
  return fits;
}

function part2(data) {
  return null;
}

module.exports = { parse, part1, part2 };
