import { Graph } from "../../graph/Graph";
import { attack } from "./afterglow";

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

const graph = new Graph<
  | "no damage"
  | "light wound"
  | "severe wound"
  | "critical wound"
  | "fatal wound"
>((a, b) => sortedDamage[a] - sortedDamage[b]);

graph.addDataset(
  "head shoot",
  attack({
    attackDices: 3,
    defenceThreshold: 7,
    weaponDamage: 4,
    headArmour: 6,
    bodyArmour: 9,
    tryAimForHead: true,
  })
);

graph.addDataset(
  "body shoot",
  attack({
    attackDices: 3,
    defenceThreshold: 7,
    weaponDamage: 4,
    headArmour: 6,
    bodyArmour: 9,
    tryAimForHead: false,
  })
);

graph.saveToFile(__dirname + '/graph.html')