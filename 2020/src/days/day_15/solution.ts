import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

const day15: Day = (input: DayInput) => {
  const data: number[] = input.split(',').map(entry => Number(entry));

    const determineElementAt = (position: number) => {
        const lastIndexOfValue = new Map<number, number>(
            data.map((value, index) => [value, index])
        );

        let prevValue = data[data.length - 1];

        for (let index = data.length; index < position; ++index) {
           const prevIndex = index - 1;
           const nextValue =
           prevIndex - (lastIndexOfValue.get(prevValue) ?? prevIndex);
           lastIndexOfValue.set(prevValue, prevIndex);
           prevValue = nextValue;
        }

        return prevValue;
    };

    const partOne = () => determineElementAt(2020);

    const partTwo = () => determineElementAt(30000000);

  return [partOne, partTwo];
};

export default day15;
