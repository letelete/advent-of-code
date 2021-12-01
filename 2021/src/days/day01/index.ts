import { accumulate, countIncreases, groupIntoChunks } from './_solution';

import { Data } from './_types';
import { Day } from '../../shared/types';
import { parse } from './_parse';

const day: Day = (props) => {
  const data: Data = parse(props.input);

  const partOne = () => {
    return countIncreases(data).toString();
  };

  const partTwo = () => {
    const chunksWidth = 3;
    const accumulated = groupIntoChunks(data, chunksWidth).map(accumulate);
    return countIncreases(accumulated).toString();
  };

  return { parts: [partOne, partTwo] };
};

export default day;
