import { Data, Occurrences } from './_types';

export const columnsToRows = (data: Data): Data => {
  return data
    .map((entry) => entry.split(''))
    .reduce((transformed: Data, entry: string[]) => {
      return transformed
        .map((transformedColumn, index) => [...transformedColumn, entry[index]])
        .map((transformedColumn) => transformedColumn.join(''));
    });
};

export const countCharactersInString = (str: string): Occurrences => {
  return str
    .split('')
    .reduce(
      (occursMap, char) => occursMap.set(char, (occursMap.get(char) || 0) + 1),
      new Map<string, number>()
    );
};

export const countBits = (data: Data): Occurrences[] => {
  return data.map(countCharactersInString).map((occursMap) => {
    if (!occursMap.has('0')) occursMap.set('0', 0);
    if (!occursMap.has('1')) occursMap.set('1', 0);
    return occursMap;
  });
};

export const determineGammaRate = (occurrences: Occurrences[]): string => {
  return occurrences
    .map((column) =>
      (column.get('0') || 0) > (column.get('1') || 0) ? '0' : '1'
    )
    .join('');
};

export const determineEpsilonRate = (occurrences: Occurrences[]): string => {
  return determineGammaRate(occurrences)
    .split('')
    .map((bit) => (bit === '1' ? '0' : '1'))
    .join('');
};

export const findPowerConsumption = (data: Data): number => {
  const transformed = columnsToRows(data);
  const occurrences = countBits(transformed);
  const gamma = determineGammaRate(occurrences);
  const epsilon = determineEpsilonRate(occurrences);
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

export const findByBitCriteria = (
  data: Data,
  predicateStrategy: (
    columnOccurs: Occurrences,
    currentChar: string
  ) => boolean,
  atIndex: number = 0
): Data => {
  const transformed = columnsToRows(data);
  const occurrences = countBits(transformed);
  if (atIndex > occurrences.length) return [];
  const considered = data.filter((entry) => {
    return predicateStrategy(occurrences[atIndex], entry[atIndex]);
  });
  return considered.length === 1
    ? considered
    : findByBitCriteria(considered, predicateStrategy, atIndex + 1);
};

export const determineOxygenRating = (data: Data) => {
  return findByBitCriteria(data, (columnOccurs, currentChar) => {
    return (columnOccurs.get('1') || 0) >= (columnOccurs.get('0') || 0)
      ? currentChar === '1'
      : currentChar === '0';
  }).join('');
};

export const determineCO2Rating = (data: Data) => {
  return findByBitCriteria(data, (columnOccurs, currentChar) => {
    return (columnOccurs.get('0') || 0) <= (columnOccurs.get('1') || 0)
      ? currentChar === '0'
      : currentChar === '1';
  }).join('');
};

export const findLifeSupportRating = (data: Data) => {
  const oxygenRating = determineOxygenRating(data);
  const co2Rating = determineCO2Rating(data);
  return parseInt(oxygenRating, 2) * parseInt(co2Rating, 2);
};
