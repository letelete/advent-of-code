import DayInput from './day_input.interface';
import Solution from './solution.interface';

export default interface Day {
  (input: DayInput): Solution[];
}
