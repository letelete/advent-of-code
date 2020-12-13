const fs = require('fs');
const path = require('path');

const day8 = input => {
  const instructions = [...input.matchAll(/^(\w+)\s([-+]\d+)$/gm)].map(
    groups => ({
      code: groups[1],
      value: parseInt(groups[2]),
    })
  );

  const replaceable = {
    nop: 'jmp',
    jmp: 'nop',
  };

  const handleEvent = ({onJump, onAcc}) => (code, value) =>
    ({
      acc: val => {
        onJump(1);
        onAcc(val);
      },
      nop: _ => onJump(1),
      jmp: val => {
        onJump(val);
      },
    }[code](value));

  const part1 = () => {
    const visited = new Set();
    let acc = 0;
    let index = 0;

    while (!visited.has(index)) {
      visited.add(index);
      handleEvent({
        onJump: val => (index += val),
        onAcc: val => (acc += val),
      })(instructions[index].code, instructions[index].value);
    }

    return acc;
  };

  const part2 = () => {
    const backtrackAt = (index, acc, code, maxBacktrackingDepth, visited) => {
      const nextVisitedIndex = new Set([...visited, index]);

      handleEvent({
        onJump: val => (index += val),
        onAcc: val => (acc += val),
      })(replaceable[code], instructions[index].value);

      return findAcc(
        index,
        acc,
        instructions[index].code,
        maxBacktrackingDepth - 1,
        nextVisitedIndex
      );
    };

    const findAcc = (index, acc, code, maxBacktrackingDepth, visited) => {
      if (index >= instructions.length) return acc;
      if (visited.has(index)) return null;

      const backtrackingResult =
        replaceable[code] &&
        maxBacktrackingDepth > 0 &&
        backtrackAt(index, acc, code, maxBacktrackingDepth, visited);

      visited.add(index);

      handleEvent({
        onJump: val => (index += val),
        onAcc: val => (acc += val),
      })(code, instructions[index].value);

      return (
        backtrackingResult ||
        findAcc(
          index,
          acc,
          instructions[index]?.code,
          maxBacktrackingDepth,
          visited
        )
      );
    };

    return findAcc(0, 0, instructions[0].code, 1, new Set());
  };

  return {
    part1,
    part2,
  };
};

const input = fs.readFileSync(path.resolve(__dirname, 'input'), 'utf-8');
Object.values(day8(input)).forEach((solution, index) =>
  console.log(`Part ${index + 1}`, solution())
);
