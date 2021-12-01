export type Answer = string;

export type Input = string;

export type DayProps = {
  input: Input;
};

export type DayPartResponse = () => Answer;

export type DayResponse = { parts: DayPartResponse[] };

export type Day = (props: DayProps) => DayResponse;
