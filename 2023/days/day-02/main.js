const fs = require("fs");

const parse = (source) => source.split("\n").filter(Boolean).map((record) => {
  const [index, game] = record.split(':').map(e => e.trim())
  const gameIndex = Number(index.split('Game ')[1])

  const sets = game.split('; ').map(round => 
    round.split(', ')
      .map(cube => cube.split(' '))
      .map(([count, type]) => ({ count: Number(count), type }))
  )

  return { gameIndex, sets }
});;

const data = parse(fs.readFileSync("in.txt", "utf-8"));
const testOne = parse(fs.readFileSync("test.one.txt", "utf-8"));
const testTwo = parse(fs.readFileSync("test.two.txt", "utf-8"));

Array.prototype.sum = function() {
  return this.reduce((sum, value) => sum + value, 0);
}

Array.prototype.product = function() {
  return this.reduce((x, value) => x * value, 1);
}

const partOne = (data) => {
  const bag = { red: 12, green: 13, blue: 14 }

  return data.filter(({ sets }) =>
    sets.every(round =>
      round.every(({ count, type }) => count <= bag[type])
    )
  ).map(({gameIndex}) => gameIndex).sum()
};

const partTwo = (data) => {
  return data.map(({ sets }) => {
    return sets.reduce((minAmountForGame, round) => {
      round.forEach(({count, type}) => {
        minAmountForGame[type] = Math.max(minAmountForGame[type], count)
      })
      return minAmountForGame
    }, { red: 0, green: 0, blue: 0 })
  }).map((minAmountForGame) => Object.values(minAmountForGame).product())
    .sum()
};

console.log("\x1b[31m--- DATA---\x1b[0m\n", data);
console.log("\x1b[31m--- TEST PART ONE ---\x1b[0m\n", partOne(testOne));
console.log("\x1b[31m--- TEST PART TWO ---\x1b[0m\n", partTwo(testTwo));
console.log()
console.log("\x1b[31m--- PART ONE ---\x1b[0m\n", partOne(data));
console.log("\x1b[31m--- PART TWO ---\x1b[0m\n", partTwo(data));