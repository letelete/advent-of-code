import { config } from '../shared/config';

export const readSolutionDayNumber = (): number => {
  const day = Number(process.env.npm_config_day ?? config.aocFirstDay);
  if (day < config.aocFirstDay || day > config.aocLastDay) {
    throw new Error(
      `The day argument must be a number between ${config.aocFirstDay} and ${config.aocLastDay}, you entered ${day}.`
    );
  }
  return day;
};
