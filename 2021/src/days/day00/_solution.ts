import { Data } from './_types';

export const addition = (data: Data) => {
  return data.reduce((a, b) => a + b, 0);
};

export const subtraction = (data: Data) => {
  return data.reduce((a, b) => a - b);
};
