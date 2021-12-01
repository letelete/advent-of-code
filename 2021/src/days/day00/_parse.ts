import { Data } from './_types';
import { Input } from '../../shared/types';

export const parse = (input: Input): Data => {
  return input.split('\n').map((e) => parseInt(e));
};
