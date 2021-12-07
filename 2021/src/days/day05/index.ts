import { Data, Line } from './_types';
import { countOverlaps, isDiagonal } from './_solution';

import { Day } from '../../shared/types';
import { parse } from './_parse';

const day: Day = (props) => {
  const data: Data = parse(props.input);

  const partOne = () => {
    const isStraight = (line: Line) => !isDiagonal(line);
    return countOverlaps(data.filter(isStraight)).toString();
  };

  const partTwo = () => {
    return countOverlaps(data).toString();
  };

  return { parts: [partOne, partTwo] };
};

export default day;
