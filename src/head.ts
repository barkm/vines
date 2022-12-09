import { saturate, uniform } from "./utils";

export interface Head extends Iterator<[number, number]> {
  spawn(): Head[];
}

export class Branch implements Head {
  #position: [number, number];
  #direction: number;
  #step_length: number;
  #direction_delta: number;
  #stop_prob: number;
  #branch_prob: number;
  #leaf_prob: number;
  #done: boolean = false;
  constructor({
    position,
    direction = 0,
    step_length = 20,
    direction_delta = Math.PI / 5,
    stop_prob = 0.001,
    branch_prob = 0.01,
    leaf_prob = 0.2,
  }: {
    position: [number, number];
    direction?: number;
    step_length?: number;
    direction_delta?: number;
    stop_prob?: number;
    branch_prob?: number;
    leaf_prob?: number;
  }) {
    this.#position = position;
    this.#direction = direction;
    this.#step_length = step_length;
    this.#direction_delta = direction_delta;
    this.#stop_prob = stop_prob;
    this.#branch_prob = branch_prob;
    this.#leaf_prob = leaf_prob;
  }
  next(): IteratorResult<[number, number]> {
    if (!this.#done) {
      this.#direction += uniform(-1, 1) * this.#direction_delta;
      this.#position[0] += this.#step_length * Math.cos(this.#direction);
      this.#position[1] += this.#step_length * Math.sin(this.#direction);

      this.#done = uniform(0, 1) < this.#stop_prob;
    }
    return {
      value: [...this.#position],
      done: this.#done,
    };
  }
  spawn(): Head[] {
    if (uniform(0, 1) < this.#leaf_prob) {
      return makeLeaf({
        position: [...this.#position],
        direction: this.#direction + (uniform(-1, 1) * Math.PI) / 3,
      });
    }
    if (uniform(0, 1) < this.#branch_prob) {
      return [
        new Branch({
          position: [...this.#position],
          direction: this.#direction,
          direction_delta: saturate(this.#direction_delta, Math.PI / 2),
          stop_prob: saturate(5 * this.#stop_prob),
          branch_prob: saturate(5 * this.#branch_prob),
        }),
      ];
    }
    return [];
  }
}
interface LeafParams {
  position: [number, number];
  direction?: number;
  length?: number;
  width?: number;
  steps?: number;
}

const makeLeaf = (params: LeafParams): [Head, Head] => {
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
