export const uniform = (a: number, b: number) => (b - a) * Math.random() + a;

export const saturate = (x: number, max: number = 1) =>
  max * Math.tanh(x / max);

const range = (n: number) => [...Array(n).keys()];

export const linspace = (a: number, b: number, n: number) =>
  range(n).map((i) => (i * (b - a)) / n + a);
