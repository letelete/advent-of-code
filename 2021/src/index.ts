import { Answer, DayPartResponse, DayResponse } from './shared/types';

import { config } from './shared/config';
import { performance } from 'perf_hooks';
import { print } from './utils/print';
import readInput from './utils/readInput';
import { readSolutionDayNumber } from './utils/readArguments';

const printPart = (partResponse: DayPartResponse, partNumber: number) => {
  print.subtitle(`Part ${partNumber}`);
  const startTime = performance.now();
  const answer = partResponse();
  const endTime = performance.now();
  print.section('Time (ms)');
  print.body(`${Math.round((endTime - startTime) * 100) / 100}`);
  print.section('Answer');
  print.answer(answer);
};

const printDay = async () => {
  const dayNumber = readSolutionDayNumber();
  const dayInput = readInput(dayNumber);
  const dayDirPath = config.dayDirectoryPath(dayNumber);
  print.title(`Day ${dayNumber}`);
  const response = (await import(dayDirPath)).default({
    input: dayInput,
  }) as DayResponse;
  response.parts.forEach((part, index) => printPart(part, index + 1));
};

printDay();
