/**
 * I should've used syntax trees for that, but I really wanted to give
 * a try to prioritizing mathematical operations by parenthesis insertion (:
 *
 * I will probably rewrite this when the AoC end.
 */

import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

const parenthesis = ['(', ')'] as const;
const operators = ['+', '*'] as const;

type Operator = typeof operators[number];
type Parenthesis = typeof parenthesis[number];
type SequenceElement = number | Operator | Parenthesis;
type Sequence = SequenceElement[];

const day18: Day = (input: DayInput) => {
  const data: Sequence[] = input.split(/\n/).map(e =>
    e
      .trim()
      .split('')
      .filter(e => e.trim())
      .map(e => {
        if (parenthesis.includes(e as Parenthesis)) {
          return e as Parenthesis;
        } else if (operators.includes(e as Operator)) {
          return e as Operator;
        }
        return Number(e);
      })
  );

  const calcWithOperator = (a: number, b: number, o: Operator): number => {
    switch (o) {
      case '+':
        return a + b;
      case '*':
        return a * b;
      default:
        throw new Error(`Expected ${operators}, but got ${o}.`);
    }
  };

  const resolveSequence = (seq: Sequence, index: number = 0): number => {
    let sum: number = 0;
    let nextOperator: Operator = '+';
    let nestingLevel: number = 0;

    const handleSequenceValue = (value: SequenceElement): void => {
      if (operators.includes(value as Operator)) {
        nextOperator = value as Operator;
      } else if (parenthesis.includes(value as Parenthesis)) {
        if (value === ')') return;
        sum = calcWithOperator(
          sum,
          resolveSequence(seq, index + 1),
          nextOperator
        );
      } else {
        sum = calcWithOperator(sum, Number(value), nextOperator);
      }
    };

    for (; index < seq.length; ++index) {
      const value = seq[index];
      if (!nestingLevel && value === ')') break;
      if (!nestingLevel) handleSequenceValue(value);
      if (parenthesis.includes(value as Parenthesis)) {
        nestingLevel += value === ')' ? -1 : 1;
      }
    }

    return sum;
  };

  const parenthesize = (originalSequence: Sequence): Sequence => {
    let seq = [...originalSequence];

    const findSliceSegment = (index: number): [number, number] => {
      const find = (i: number, moveBy: -1 | 1) => {
        let nestingLevel: number = 0;
        for (i = i + moveBy; i < seq.length && i >= 0; i += moveBy) {
          const value = seq[i];
          if (parenthesis.includes(value as Parenthesis)) {
            nestingLevel += (value === ')' ? -1 : 1) * moveBy;
          }
          if (!nestingLevel) break;
        }
        return i;
      };
      return [find(index, -1), find(index, 1)];
    };

    const occurs = seq.filter((e: SequenceElement) => (e as Operator) === '+')
      .length;

    for (let i = 1; i <= occurs; ++i) {
      for (let j = 0, spot = 0; i < seq.length; ++j) {
        if (seq[j] === '+') spot++;
        if (i - spot <= 0) {
          const [l, r] = findSliceSegment(j);
          seq = [
            ...seq.slice(0, l),
            ...['(' as Parenthesis, ...seq.slice(l, r + 1), ')' as Parenthesis],
            ...seq.slice(r + 1, seq.length),
          ];
          break;
        }
      }
    }

    return seq;
  };

  const partOne = () =>
    data.reduce(
      (sum: number, next: Sequence): number => sum + resolveSequence(next),
      0
    );

  const partTwo = () => {
    return data.reduce(
      (sum: number, next: Sequence): number =>
        sum + resolveSequence(parenthesize(next)),
      0
    );
  };

  return [partOne, partTwo];
};

export default day18;
