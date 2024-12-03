declare global {
  interface Array<T extends number> {
    sum(): T extends number ? number : never;
    product(): T extends number ? number : never;
  }
}

Array.prototype.sum = function () {
  if (this.every((item) => typeof item === 'number')) {
    return this.reduce((acc, curr) => acc + (curr as unknown as number), 0);
  } else {
    throw new Error('sum can only be called on arrays of numbers.');
  }
};

Array.prototype.product = function () {
  if (this.every((item) => typeof item === 'number')) {
    return this.reduce((acc, curr) => acc * (curr as unknown as number), 1);
  } else {
    throw new Error('product can only be called on arrays of numbers.');
  }
};

const Comp = {
  num: {
    desc: (a: number, b: number) => b - a,
    asc: (a: number, b: number) => a - b,
  },
};

export { Comp };
