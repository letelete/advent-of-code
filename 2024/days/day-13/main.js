function parse(source) {
  return source
    .trim()
    .split('\n\n')
    .map((segment) => {
      const [, aX, aY, bX, bY, prizeX, prizeY] = segment.match(
        /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/
      );
      return {
        a: [Number(aX), Number(aY)],
        b: [Number(bX), Number(bY)],
        prize: [Number(prizeX), Number(prizeY)],
      };
    });
}

const COST_A = 3;
const COST_B = 1;

// ax * ta + bx * tb = X
// ay * ta + by * tb = Y
// thus:
// ta = (X - bx * tb) / ax, where ax !== 0
// ta = (Y - by * tb) / ay, where ay !== 0
// thus:
// (X - bx * tb) / ax = (Y - by * tb) / ay, where ax !== 0, ay !== 0
// thus:
// ay * (X - bx * tb) = ax * (Y - by * tb)
// thus:
// ay * X - ay * bx * tb = ax * Y - ax * by * tb
// ay * X - ax * Y = ay * bx * tb - ax * by * tb
// thus:
// tb = (ay * X - ax * Y) / (ay * bx - ax * by), where ay !== 0, bx !== 0, ax !== 0, by != 0
function minTokensToWin([ax, ay], [bx, by], [X, Y]) {
  if ([ax, ay, bx, by].some((v) => v === 0)) return null;
  const tb = Math.floor((ay * X - ax * Y) / (ay * bx - ax * by));
  const ta = Math.floor((X - bx * tb) / ax);
  return ax * ta + bx * tb === X && ay * ta + by * tb === Y ? { ta, tb } : null;
}

function minTokensToWinAll(data, delta = 0) {
  return data
    .map(({ prize, ...rest }) => ({
      ...rest,
      prize: prize.map((p) => p + delta),
    }))
    .map(({ a, b, prize }) => minTokensToWin(a, b, prize))
    .filter(Boolean)
    .map(({ ta, tb }) => ta * COST_A + tb * COST_B)
    .reduce((sum, v) => sum + v, 0);
}

function part1(data) {
  return minTokensToWinAll(data);
}

function part2(data) {
  return minTokensToWinAll(data, 10000000000000);
}

module.exports = { parse, part1, part2 };
