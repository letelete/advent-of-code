import { Answer } from '../shared/types';
import { getRandomEmoji } from '../utils/emojis';

const symbols = {
  title: '===',
  subtitle: '==',
  section: '-',
};

export const print = {
  title: (str: string) =>
    console.log(symbols.title, str, getRandomEmoji(), ' ', symbols.title, '\n'),
  subtitle: (str: string) =>
    console.log(symbols.subtitle, str, symbols.subtitle, '\n'),
  section: (str: string) => console.log(symbols.section, str, symbols.section),
  body: (str: string) => console.log(str, '\n'),
  answer: (ans: Answer) => console.log(ans, '\n'),
};
