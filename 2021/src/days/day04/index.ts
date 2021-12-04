import { Data } from './_types';
import { Day } from '../../shared/types';
import { findWinningBoards } from './_solution';
import { parse } from './_parse';

const day: Day = (props) => {
  const data: Data = parse(props.input);

  const partOne = () => {
    const winner = findWinningBoards(data)[0];
    return (winner.score * winner.recentNumber).toString();
  };

  const partTwo = () => {
    const winners = findWinningBoards(data);
    const last = winners[winners.length - 1];
    return (last.score * last.recentNumber).toString();
  };

  return { parts: [partOne, partTwo] };
};

export default day;
