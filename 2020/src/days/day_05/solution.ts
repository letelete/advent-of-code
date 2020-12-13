import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

type Code = string;

type SeatId = number;

interface SegmentData {
  min: number;
  max: number;
  codeLength: number;
}

const day5: Day = (input: DayInput) => {
  const row: SegmentData = {min: 0, max: 127, codeLength: 7};
  const column: SegmentData = {min: 0, max: 7, codeLength: 3};

  const data: Code[] = input.split('\n');

  const binarySearch = (
    low: number,
    hi: number,
    shouldSelectFirstHalf: (iteration: number) => boolean
  ): number => {
    let iteration = 0;
    while (hi - low > 1) {
      const mid = Math.floor((hi - low) / 2 + low);
      if (shouldSelectFirstHalf(iteration++)) hi = mid;
      else low = mid;
    }
    return shouldSelectFirstHalf(iteration) ? low : hi;
  };

  const getRow = (code: Code): number => {
    return binarySearch(row.min, row.max, iteration => code[iteration] === 'F');
  };

  const getColumn = (code: Code): number => {
    return binarySearch(
      column.min,
      column.max,
      iteration => code[row.codeLength + iteration] === 'L'
    );
  };

  const getSeatId = (row: number, column: number): SeatId => row * 8 + column;

  const getSeatIdForCode = (code: Code): SeatId =>
    getSeatId(getRow(code), getColumn(code));

  const partOne = () => {
    return data.reduce(
      (highest: number, nextCode: Code) =>
        Math.max(highest, getSeatIdForCode(nextCode)),
      0
    );
  };

  const partTwo = () => {
    const maxSeatId = getSeatId(row.max, column.max);
    const assignedSeats: boolean[] = Array.from({length: maxSeatId});

    let minId: SeatId = maxSeatId;
    let maxId: SeatId = 0;

    data.forEach((code: Code) => {
      const id = getSeatIdForCode(code);
      assignedSeats[id] = true;

      minId = Math.min(id, minId);
      maxId = Math.max(id, maxId);

      return id;
    });

    return Number(
      Object.keys(assignedSeats).find((id: string) => {
        const seatId: SeatId = Number(id);
        return !assignedSeats[seatId] && seatId > minId && seatId < maxId;
      })
    );
  };

  return [partOne, partTwo];
};

export default day5;
