import { findLifeSupportRating, findPowerConsumption } from './_solution';

import { Data } from './_types';
import { Day } from '../../shared/types';
import { parse } from './_parse';

const day: Day = (props) => {
  const data: Data = parse(props.input);

  const partOne = () => {
    return findPowerConsumption(data).toString();
  };

  const partTwo = () => {
    return findLifeSupportRating(data).toString();
  };

  return { parts: [partOne, partTwo] };
};

export default day;
