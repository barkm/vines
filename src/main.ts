import { CanvasPlotter, Plotter } from "./plotter";
import { Head } from "./heads/head";
import { Branch } from "./heads/branch";
import { linspace } from "./utils";
import "./style.css";

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
      plotter: new CanvasPlotter(
        [...position],
        context,
        canvas.width,
        canvas.height
      ),
    })
  );
};

const width = window.devicePixelRatio * window.innerWidth;
const height = window.devicePixelRatio * window.innerHeight;

traces = generate([width / 2, height / 2]);

setInterval(() => {
  traces.push(...generate([Math.random() * width, Math.random() * height]));
}, 10000);

canvas.addEventListener("click", (event: MouseEvent) => {
  const position = [
    window.devicePixelRatio * event.x,
    window.devicePixelRatio * event.y,
  ] as [number, number];
  traces.push(...generate(position));
});

let i = 0;
const animate = () => {
  context.globalAlpha = 0.5;
  traces = update(traces);
  if (!traces.length) {
    if (i > 60) {
      context.globalAlpha = 0.1;
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    i++;
  } else {
    i = 0;
  }
  requestAnimationFrame(animate);
};
animate();
