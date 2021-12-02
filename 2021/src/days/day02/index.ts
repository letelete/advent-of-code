import { Coords, CoordsWithAim, Data } from './_types';
import {
  applyMoves,
  applyMovesWithAim,
  runInstructions,
  taskStates,
} from './_solution';

import { Day } from '../../shared/types';
import { parse } from './_parse';

const day: Day = (props) => {
  const data: Data = parse(props.input);

  const partOne = () => {
    const initialPos = { x: 0, y: 0 } as Coords;
    const moves = runInstructions(data, taskStates);
    const currentPos = applyMoves(initialPos, moves);
    return (currentPos.x * currentPos.y).toString();
  };

  const partTwo = () => {
    const initialPos = { x: 0, y: 0, aim: 0 } as CoordsWithAim;
    const moves = runInstructions(data, taskStates);
    const currentPos = applyMovesWithAim(initialPos, moves);
    return (currentPos.x * currentPos.y).toString();
  };

  return { parts: [partOne, partTwo] };
};

export default day;
