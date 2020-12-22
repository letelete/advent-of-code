import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

const day14: Day = (input: DayInput) => {
  const data: string[][] = input
    .split(/\n/)
    .map(entry => {
      const reMask = /^mask\s=\s([1X0]+)$/;
      const reMem = /^mem\[(\d+)\]\s=\s(\d+)$/;
      return (
        entry.match(reMask)?.slice(1) || entry.match(reMem)?.slice(1) || []
      );
    })
    .filter(e => e.length);

  const partOne = () => {
    let mask: string = data[0][0];
    let obj: {[key: string]: string[]} = {};

    for (const entry of data) {
      if (entry.length <= 1) {
        mask = entry[0];
        continue;
      }
      const at = entry[0];
      const val = Number(entry[1]).toString(2);
      obj[at] = mask.split('').map(e => (e === 'X' ? '0' : e));
      for (let i = 0; i < val.length; ++i) {
        const maskIndex = mask.length - 1 - i;
        const valIndex = val.length - 1 - i;
        obj[at][maskIndex] =
          mask[maskIndex] === '1' || mask[maskIndex] === '0'
            ? mask[maskIndex]
            : obj[at][maskIndex] === '1' || val[valIndex] === '1'
            ? '1'
            : '0';
      }
    }

    return Object.values(obj).reduce(
      (sum, next) => sum + parseInt(next.join(''), 2),
      0
    );
  };

  const partTwo = () => {
    let mask: string = data[0][0];
    let obj: {[key: string]: number} = {};

    const generatePermutations = (original: string[]): string[][] => {
      let gen: string[][] = [];
      const permute = (addr: string[], index: number): void => {
        if (index >= addr.length) {
          gen.push(addr);
          return;
        }
        if (addr[index] !== 'X') return permute(addr, index + 1);
        permute(
          [...addr.slice(0, index), '1', ...addr.slice(index + 1, addr.length)],
          index + 1
        );
        permute(
          [...addr.slice(0, index), '0', ...addr.slice(index + 1, addr.length)],
          index + 1
        );
      };
      permute(original, 0);
      return gen;
    };

    for (const entry of data) {
      if (entry.length <= 1) {
        mask = entry[0];
        continue;
      }
      const at = Number(entry[0]).toString(2);
      let addr = mask.split('');
      for (let i = 0; i < at.length; ++i) {
        const addrIndex = addr.length - 1 - i;
        const addrVal = addr[addrIndex];
        addr[addrIndex] =
          addrVal === 'X' ? 'X' : addrVal === '1' ? '1' : at[at.length - 1 - i];
      }
      generatePermutations(addr).forEach(perm => {
        const index = parseInt(perm.join(''), 2).toString();
        obj[index] = Number(entry[1]);
      });
    }
    return Object.values(obj).reduce((sum, next) => sum + next, 0);
  };

  return [partOne, partTwo];
};

export default day14;
