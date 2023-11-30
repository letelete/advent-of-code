const fs = require('fs');

const parse = (source) => source.split('\n').filter(Boolean);

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const test = parse(fs.readFileSync('test.txt', 'utf-8'));

const partOne = () => {

}

const partTwo = () => {

}

console.log('\x1b[31m---BEGIN DATA---\x1b[0m\n', data, '\n\x1b[31m---END DATA---\x1b[0m\n');
console.log('\x1b[31m---BEGIN TEST---\x1b[0m\n', test, '\n\x1b[31m---END TEST---\x1b[0m\n');
console.log('\x1b[42m---BEGIN PART ONE ---\x1b[0m\n', partOne(), '\n\x1b[42m---END PART ONE ---\x1b[0m\n');
console.log('\x1b[42m---BEGIN PART TWO ---\x1b[0m\n', partTwo(), '\n\x1b[42m---END PART TWO ---\x1b[0m\n');
