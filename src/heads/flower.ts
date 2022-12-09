import { Head } from "./head";
import { LeafParams, makeLeaf } from "./leaf";
import { linspace, uniform } from "../utils";

export const makeFlower = (
  numLeaves: number,
  {
    position,
    direction = 0,
    length = 40,
    width = 10,
    steps = 40,
    color = "black",
  }: LeafParams
): Head[] => {
  return linspace(0, 2 * Math.PI, numLeaves).flatMap((d) =>
    makeLeaf({
      position: position,
      direction: direction + uniform(0.98, 1.02) * d,
      length: uniform(0.9, 1.1) * length,
      width: width,
      steps: steps,
      color: color,
    })
  );
};
