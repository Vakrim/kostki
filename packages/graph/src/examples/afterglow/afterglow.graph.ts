import { Graph } from "../../Graph";

const sortedDamage = Object.fromEntries(
  (
    [
      "no damage",
      "light wound",
      "severe wound",
      "critical wound",
      "fatal wound",
    ] as const
  ).map((name, index) => [name, index])
);

export function getAfterglowGraph() {
  return new Graph<
  | "no damage"
  | "light wound"
  | "severe wound"
  | "critical wound"
  | "fatal wound"
>((a, b) => sortedDamage[a] - sortedDamage[b]);
}
