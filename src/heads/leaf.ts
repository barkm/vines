import { Head } from "./head";

export interface LeafParams {
  position: [number, number];
  direction?: number;
  length?: number;
  width?: number;
  steps?: number;
}

export const makeLeaf = (params: LeafParams): [Head, Head] => {
  return [new LeafSide(params, 1), new LeafSide(params, -1)];
};

enum Side {
  LEFT = 1,
  RIGHT = -1,
}

class LeafSide implements Head {
  #position: [number, number];
  #direction: number;
  #length: number;
  #width: number;
  #steps: number;
  #count: number = 0;
  #side: Side;
  constructor(
    {
      position,
      direction = 0,
      length = 40,
      width = 10,
      steps = 20,
    }: LeafParams,
    side: Side
  ) {
    this.#position = [...position];
    this.#direction = direction;
    this.#length = length;
    this.#width = width;
    this.#steps = steps;
    this.#side = side;
  }
  spawn(): Head[] {
    return [];
  }
  next(): IteratorResult<[number, number]> {
    let t = this.#count / this.#steps;
    const done = t >= 1;
    t = Math.min(t, 1);
    const x = this.#length * t;
    const y = this.#side * this.#width * Math.sin(Math.PI * t);
    const cos = Math.cos(this.#direction);
    const sin = Math.sin(this.#direction);
    const position = [
      this.#position[0] + x * cos - y * sin,
      this.#position[1] + x * sin + y * cos,
    ] as [number, number];
    this.#count += 1;
    return {
      value: position,
      done: done,
    };
  }
}
