import { State } from "./heads/head";

export interface Plotter {
  plot: (s: State) => void;
  copy: () => Plotter;
}

export class CanvasPlotter implements Plotter {
  #position: [number, number];
  #context: CanvasRenderingContext2D;
  constructor(position: [number, number], context: CanvasRenderingContext2D) {
    this.#position = position;
    this.#context = context;
  }
  plot = (state: State) => {
    this.#context.beginPath();
    this.#context.moveTo(...this.#position);
    this.#context.lineTo(...state.position);
    this.#context.strokeStyle = state.color;
    this.#context.lineWidth = 2;
    this.#context.stroke();
    this.#position = [...state.position];
  };
  copy = (): CanvasPlotter => {
    const p = new CanvasPlotter(this.#position, this.#context);
    return p;
  };
}
