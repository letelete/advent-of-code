const fs = require('fs');

const SUM_DIRECTORIES_BOUND = 100000;
const TOTAL_DISK_SPACE = 70000000;
const REQUIRED_SPACE_FOR_UPDATE = 30000000;

const sum = (a, b) => a + b;

class Node {
  constructor(name, parent = undefined) {
    this.name = name;
    this.parent = parent;
    this.files = {};
    this.children = [];
    this.size = 0;
  }
  addFile(size, name) {
    this._updateSizesForFile(name, size);
    this.files[name] = size;
  }
  addChild(node) {
    if (this.children.some(({ name }) => name === node.name)) {
      return;
    }
    this.children.push(node);
  }
  getChild(name) {
    return this.children.find((child) => child.name === name);
  }
  _updateSizesForFile(name, newSize) {
    const oldSize = this.files[name] || 0;
    let node = this;
    while (node) {
      node.size = node.size + (newSize - oldSize);
      node = node.parent;
    }
  }
}

const parse = (source) => {
  let node = undefined;

  const addNewNode = (name) => {
    if (node) {
      node.addChild(new Node(name, node));
    } else {
      node = new Node(name, node);
    }
  };

  const cdRoot = () => {
    if (!node) addNewNode('/');
    while (node.parent) node = node.parent;
  };

  const cdIn = (name) => {
    addNewNode(name);
    node = node.getChild(name);
  };

  const cdOut = () => {
    if (!node?.parent) return;
    node = node.parent;
  };

  const parser = {
    $: {
      cd: {
        '..': cdOut,
        '/': cdRoot,
        default: ([_, __, name]) => cdIn(name),
      },
      ls: () => {},
    },
    dir: ([_, name]) => addNewNode(name),
    default: ([size, name]) => node.addFile(Number(size), name),
  };

  const parseAndHandle = (args) => {
    let fn = { ...parser };
    const tokens = [...args].reverse();

    while (tokens.length && typeof fn !== 'function') {
      const token = tokens.pop();
      fn = fn[token] || fn['default'];
    }

    fn(args);
  };

  source
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(' '))
    .forEach(parseAndHandle);

  cdRoot();

  return node;
};

const data = parse(fs.readFileSync('in.txt', 'utf-8'));

const test = parse(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`);

const sumWithBound = (root, bound) => {
  if (!root) return;

  const rootSize = root.size <= bound ? root.size : 0;
  return (
    rootSize +
    root.children.map((child) => sumWithBound(child, bound)).reduce(sum, 0)
  );
};

const findMinWithBound = (root, bound, min = TOTAL_DISK_SPACE) => {
  if (!root) return min;

  const localMin = root.size < bound ? min : Math.min(root.size, min);
  if (!root.children.length) return localMin;

  return Math.min(
    ...root.children.map((child) => findMinWithBound(child, bound, localMin))
  );
};

const part1 = (fileSystemRoot) => {
  return sumWithBound(fileSystemRoot, SUM_DIRECTORIES_BOUND);
};

const part2 = (fileSystemRoot) => {
  const usedSpaceTotal = fileSystemRoot.size;
  const unusedSpaceTotal = TOTAL_DISK_SPACE - usedSpaceTotal;
  const freeSpace = unusedSpaceTotal - REQUIRED_SPACE_FOR_UPDATE;

  return freeSpace > 0
    ? 0
    : findMinWithBound(fileSystemRoot, Math.abs(freeSpace));
};

console.log('test:');
console.log(part1(test));
console.log(part2(test));
console.log('---');
console.log('answer:');
console.log(part1(data));
console.log(part2(data));
