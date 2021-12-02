import { Data, Instruction } from './_types';

import { Input } from '../../shared/types';

export const parse = (input: Input): Data => {
  return input
    .split('\n')
    .map((e) => e.split(' '))
    .map((e) => ({ instruction: e[0] as Instruction, value: parseInt(e[1]) }));
};
