import { Graph } from "../../graph/Graph";
import { sum } from "../../src/helpers";
import {
  aimedShoot,
  ArcheotechLaspistol,
  PlasmaPistol,
  semiAuto,
  simpleShoot,
} from "./guns-and-shooting";

const graph = new Graph();

graph.addDataset("simple shoot", simpleShoot);

graph.addDataset("aimed Laspistol", aimedShoot(ArcheotechLaspistol));

graph.addDataset("aimed Plasma", aimedShoot(PlasmaPistol));

graph.addDataset("semiAuto: Laspistol", semiAuto(ArcheotechLaspistol));

graph.addDataset("semiAuto: PlasmaPistol", semiAuto(PlasmaPistol));

graph.addDataset(
  "semiAuto: Laspistol and Plasma",
  sum([semiAuto(ArcheotechLaspistol, 0), semiAuto(PlasmaPistol, -20)])
);

graph.addDataset(
  "semiAuto: Plasma And Laspistol",
  sum([semiAuto(PlasmaPistol, 0), semiAuto(ArcheotechLaspistol, -20)])
);

graph.saveToFile(__dirname + '/graph.html')