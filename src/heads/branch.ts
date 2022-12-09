import { saturate, uniform } from "../utils";
import { Head } from "./head";
import { makeLeaf } from "./leaf";
import { makeFlower } from "./flower";

export class Branch implements Head {
  #position: [number, number];
  #direction: number;
  #step_length: number;
  #direction_delta: number;
  #stop_prob: number;
  #branch_prob: number;
  #leaf_prob: number;
  #flower_prob: number;
  #done: boolean = false;
  constructor({
    position,
    direction = 0,
    step_length = 10,
    direction_delta = Math.PI / 5,
    stop_prob = 0.0075,
    branch_prob = 0.01,
    leaf_prob = 0.1,
    flower_prob = 0.01,
  }: {
    position: [number, number];
    direction?: number;
    step_length?: number;
    direction_delta?: number;
    stop_prob?: number;
    branch_prob?: number;
    leaf_prob?: number;
    flower_prob?: number;
  }) {
    this.#position = position;
    this.#direction = direction;
    this.#step_length = step_length;
    this.#direction_delta = direction_delta;
    this.#stop_prob = stop_prob;
    this.#branch_prob = branch_prob;
    this.#leaf_prob = leaf_prob;
    this.#flower_prob = flower_prob;
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
      const length = uniform(30, 40);
      const width = length / 4;
      return makeLeaf({
        position: [...this.#position],
        direction: this.#direction + (uniform(-1, 1) * Math.PI) / 3,
        length: length,
        width: width,
      });
    }
    if (uniform(0, 1) < this.#flower_prob) {
      const length = uniform(40, 50);
      const width = length / 4;
      return makeFlower(10, {
        position: [...this.#position],
        direction: this.#direction + (uniform(-1, 1) * Math.PI) / 3,
        length: length,
        width: width,
      });
    }
    if (uniform(0, 1) < this.#branch_prob) {
      return [
        new Branch({
          position: [...this.#position],
          direction: this.#direction,
          direction_delta: saturate(this.#direction_delta, Math.PI / 2),
          stop_prob: saturate(1.75 * this.#stop_prob),
          branch_prob: saturate(this.#branch_prob),
          leaf_prob: saturate(this.#leaf_prob),
          flower_prob: saturate(this.#flower_prob),
        }),
      ];
    }
    return [];
  }
}
