import { State } from "./heads/head";

export interface Plotter {
  plot: (s: State) => void;
  copy: () => Plotter;
}

const notEquals = (p1: [any, any], p2: [any, any]): [any, any] => {
  return [p1[0] !== p2[0], p1[1] !== p2[1]];
};

const equals = (p1: [any, any], p2: [any, any]): [any, any] => {
  return [p1[0] === p2[0], p1[1] === p2[1]];
};

export class CanvasPlotter implements Plotter {
  #position: [number, number];
  #width: number;
  #height: number;
  #context: CanvasRenderingContext2D;
  constructor(
    position: [number, number],
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    this.#position = position;
    this.#context = context;
    this.#width = width;
    this.#height = height;
  }

  #wrap = (position: [number, number]): [number, number] => {
    const [x, y] = position;
    return [
      x < 0 ? this.#width + x : x > this.#width ? x - this.#width : x,
      y < 0 ? this.#height + y : y > this.#height ? y - this.#height : y,
    ];
  };

  plot = (state: State) => {
    const wrappedPrev = this.#wrap(this.#position);
    const wrappedNext = this.#wrap(state.position);
    this.#context.beginPath();
    if (
      equals(
        notEquals(wrappedPrev, this.#position),
        notEquals(wrappedNext, state.position)
      ).every(Boolean)
    ) {
      this.#context.moveTo(...wrappedPrev);
      this.#context.lineTo(...wrappedNext);
      this.#context.strokeStyle = state.color;
      this.#context.lineWidth = 2;
      this.#context.stroke();
    }
    this.#position = [...state.position];
  };
  copy = (): CanvasPlotter => {
    const p = new CanvasPlotter(
      this.#position,
      this.#context,
      this.#width,
      this.#height
    );
    return p;
  };
}
