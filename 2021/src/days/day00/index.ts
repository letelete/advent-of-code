import { addition, subtraction } from './_solution';

import { Data } from './_types';
import { Day } from '../../shared/types';
import { parse } from './_parse';

const day: Day = (props) => {
  const data: Data = parse(props.input);

  const partOne = () => {
    return addition(data).toString();
  };

  const partTwo = () => {
    return subtraction(data).toString();
  };

  return { parts: [partOne, partTwo] };
};

export default day;
