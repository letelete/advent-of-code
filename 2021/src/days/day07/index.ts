import {
  findAlignmentInOwnWay,
  findAlignmentWithCrabEngineering,
} from './_solution';

import { Data } from './_types';
import { Day } from '../../shared/types';
import { parse } from './_parse';

const day: Day = (props) => {
  const data: Data = parse(props.input);

  const partOne = () => findAlignmentInOwnWay(data).toString();

  const partTwo = () => findAlignmentWithCrabEngineering(data).toString();

  return { parts: [partOne, partTwo] };
};

export default day;
