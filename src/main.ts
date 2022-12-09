import { CanvasPlotter, Plotter } from "./plotter";
import { Head } from "./heads/head";
import { Branch } from "./heads/branch";
import { linspace } from "./utils";

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.devicePixelRatio * window.innerWidth;
canvas.height = window.devicePixelRatio * window.innerHeight;
canvas.style.width = window.innerWidth.toString() + "px";
canvas.style.height = window.innerHeight.toString() + "px";
let context = canvas.getContext("2d");

interface Trace {
  head: Head;
  plotter: Plotter;
}

let update = (traces: Trace[]): Trace[] =>
  traces
    .filter((trace) => {
      const res = trace.head.next();
      trace.plotter.plot(res.value);
      return !res.done;
    })
    .flatMap((trace) => {
      return [
        trace,
        ...trace.head
          .spawn()
          .map((head) => ({ head: head, plotter: trace.plotter.copy() })),
      ];
    });

let traces: Trace[] = [];

const generate = (position: [number, number]) => {
  return linspace(0, 2 * Math.PI, 10).map(
    (d): Trace => ({
      head: new Branch({
        position: [...position],
        direction: d,
      }),
      plotter: new CanvasPlotter([...position], context),
    })
  );
};

traces = generate([canvas.width / 2, canvas.height / 2]);

canvas.addEventListener("click", (event: MouseEvent) => {
  const position = [
    window.devicePixelRatio * event.x,
    window.devicePixelRatio * event.y,
  ] as [number, number];
  traces.push(...generate(position));
});

const animate = () => {
  traces = update(traces);
  // context.globalAlpha = 0.05;
  // context.fillStyle = "white";
  // context.fillRect(0, 0, canvas.width, canvas.height);
  // context.globalAlpha = 1.0;
  requestAnimationFrame(animate);
};
animate();
