import { uniform } from "./utils";

export interface Plotter {
  plot: (p: [number, number]) => void;
  copy: () => Plotter;
}

export class CanvasPlotter implements Plotter {
  #position: [number, number];
  #context: CanvasRenderingContext2D;
  #count: number = uniform(0, 360);
  constructor(position: [number, number], context: CanvasRenderingContext2D) {
    this.#position = position;
    this.#context = context;
  }
  plot = (position: [number, number]) => {
    this.#context.beginPath();
    this.#context.moveTo(...this.#position);
    this.#context.lineTo(...position);
    // this.#context.strokeStyle = `hsl(${this.#count % 360}, 100%, 75%)`;
    this.#context.lineWidth = 0.5;
    this.#context.stroke();
    this.#position = position;
    this.#count += 1;
  };
  copy = (): CanvasPlotter => {
    const p = new CanvasPlotter(this.#position, this.#context);
    p.#count = this.#count;
    return p;
  };
}
