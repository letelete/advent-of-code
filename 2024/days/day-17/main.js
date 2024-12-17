function parse(source) {
  const [a, b, c, ...program] = source.trim().match(/(\d+)/g).map(Number);
  return { reg: { a, b, c }, program };
}

function Computer({ reg: { a, b, c }, verbose }) {
  const state = {
    reg: { a, b, c },
    ptr: 0,
    out: [],
  };

  const noop = () => {};
  const mod = (a, b) => ((a % b) + b) % b;
  const div = (op) => Math.floor(state.reg.a / 2 ** combo(op));
  const log = (...args) => verbose && console.log('[LOG]', ...args);
  const combo = (v) => [0, 1, 2, 3, state.reg.a, state.reg.b, state.reg.c][v];

  const mvptr = () => (state.ptr += 2);

  const instructions = [
    {
      name: 'adv',
      exec: (op) => (state.reg.a = div(op)),
      mvptr,
    },
    {
      name: 'bxl',
      exec: (op) => (state.reg.b = state.reg.b ^ op),
      mvptr,
    },
    {
      name: 'bst',
      exec: (op) => (state.reg.b = mod(combo(op), 8)),
      mvptr,
    },
    {
      name: 'jnz',
      exec: noop,
      mvptr: (op) => (state.reg.a === 0 ? mvptr() : (state.ptr = op)),
    },
    {
      name: 'bxc',
      exec: () => (state.reg.b = state.reg.b ^ state.reg.c),
      mvptr,
    },
    {
      name: 'out',
      exec: (op) => state.out.push(mod(combo(op), 8)),
      mvptr,
    },
    {
      name: 'bdv',
      exec: (op) => (state.reg.b = div(op)),
      mvptr,
    },
    {
      name: 'cdv',
      exec: (op) => (state.reg.c = div(op)),
      mvptr,
    },
  ];

  const execOpcode = (opcode, operand) => {
    const instr = instructions[opcode];

    instr.exec(operand);
    instr.mvptr(operand);

    log(`(${opcode}->${instr.name})`, { ...state, out: state.out.join(',') });
  };

  const run = (program) => {
    while (state.ptr >= 0 && state.ptr < program.length - 1) {
      execOpcode(program[state.ptr], program[state.ptr + 1]);
    }
  };

  return { run, state };
}

function findMinAToOutputSelf({ reg: { b, c }, program }) {
  // If a1 >= a0 * 8, cmp.run with a=a1 retains the last digit of cmp.out for cmp.run with a=a0.
  const lowerBound = (a) => 8 * a;
  const upperBound = (a) => 8 * (a + 1) - 1;

  const lookup = (a, ptr) => {
    if (ptr < 0) {
      return a;
    }

    for (let _a = lowerBound(a); _a <= upperBound(a); ++_a) {
      const cmp = Computer({ reg: { a: _a, b, c } });
      cmp.run(program);

      if (cmp.state.out[0] === program[ptr]) {
        const _alookup = lookup(_a, ptr - 1);
        if (_alookup >= 0) {
          return _alookup;
        }
      }
    }

    return -1;
  };

  return lookup(0, program.length - 1);
}

function part1(data) {
  const cmp = Computer({ reg: data.reg, verbose: true });
  cmp.run(data.program);

  return cmp.state.out.join(',');
}

function part2(data) {
  return findMinAToOutputSelf(data);
}

module.exports = { parse, part1, part2 };
