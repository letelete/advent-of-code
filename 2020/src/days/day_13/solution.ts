import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

interface Data {
  timestamp: number;
  buses: number[];
}

interface BusRemainders {
  [bus: string]: [remainder: number];
}

const day13: Day = (input: DayInput) => {
  const partOne = () => {
    const data: Data = {
      timestamp: Number(input.split(/\n/)[0]),
      buses: input
        .split(/\n/)[1]
        .split(',')
        .filter(timestamp => timestamp !== 'x')
        .map(timestamp => Number(timestamp)),
    };

    const best: {[key: string]: number | null} = {
      bus: null,
      delta: null,
    };

    for (const bus of data.buses) {
      const delta = bus - (data.timestamp % bus);
      if (best.delta && best.delta <= delta) continue;
      best.bus = bus;
      best.delta = delta;
    }
    if (!best.bus || !best.delta) {
      throw new Error(
        `Did not find best result. Bus: ${best.bus}, Delta: ${best.delta}`
      );
    }
    return best.bus * best.delta;
  };

  const partTwo = () => {
    const busRemainders: BusRemainders = input
      .split(/\n/)[1]
      .split(',')
      .reduce((obj, entry, index) => {
        if (entry === 'x') return obj;
        const bus = Number(entry);
        return {
          ...obj,
          [entry]: !index ? 0 : bus - (index % bus),
        };
      }, {});

    /** Returns modulo inverse of a with respect to m using extended Euclid Algorithm
     * {@link https://www.geeksforgeeks.org/multiplicative-inverse-under-modulo-m/}
     */
    const modInverse = (a: number, b: number) => {
      let b0 = b;
      let x0 = 0;
      let x1 = 1;
      let q, tmp;
      if (b == 1) {
        return 1;
      }
      while (a > 1) {
        q = Math.floor(a / b);
        tmp = a;
        a = b;
        b = tmp % b;
        tmp = x0;
        x0 = x1 - q * x0;
        x1 = tmp;
      }
      if (x1 < 0) {
        x1 = x1 + b0;
      }
      return x1;
    };

    /**
     * Returns a minimal possible number T, such that, for every element in the {@param remainders}
     * the given formula T % remainder#key === remainder#value is true.
     *
     * Implements Chinese Remainders Theorem
     * {@link https://www.geeksforgeeks.org/chinese-remainder-theorem-set-2-implementation/}
     */
    const findMinTimestamp = (remainders: BusRemainders): number => {
      const product = Object.keys(remainders).reduce(
        (product, bus) => product * Number(bus),
        1
      );
      const result = Object.entries(remainders).reduce((res, entry) => {
        const bus = Number(entry[0]);
        const rem = Number(entry[1]);
        const pp = Math.floor(product / bus);
        return res + rem * pp * modInverse(pp, bus);
      }, 0);
      return result % product;
    };

    return findMinTimestamp(busRemainders);
  };

  return [partOne, partTwo];
};

export default day13;
