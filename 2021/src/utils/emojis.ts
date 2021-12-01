// The most important part (:
const emojis = ['🎄', '🏂', '✨', '⭐️', '🍪', '🎅', '🧝‍♀️', '🧝‍♂️', '🎁'];

export const getRandomEmoji = () => emojis[Math.round(Math.random() * (emojis.length - 1))];
