import { Data } from './_types';
import { Day } from '../../shared/types';
import { countFishAfterNDays } from './_solution';
import { parse } from './_parse';

const day: Day = (props) => {
  const data: Data = parse(props.input);

  const partOne = () => {
    return countFishAfterNDays(data, 80).toString();
  };

  const partTwo = () => {
    return countFishAfterNDays(data, 256).toString();
  };

  return { parts: [partOne, partTwo] };
};

export default day;
