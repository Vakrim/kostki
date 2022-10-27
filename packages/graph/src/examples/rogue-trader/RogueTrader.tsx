import { Graph } from "../../Graph";
import { Page } from "../../Page";
import { fireGun } from "./gunsAndShooting";

export function RogueTrader() {
  return (
    <Page
      schema={{
        gun: { enum: ["ArcheotechLaspistol", "PlasmaPistol"] as const },
        fireType: { enum: ["simple", "aimed", "semiAuto"] as const },
      }}
      initalDatasets={[
        {
          name: "simple shoot",
          values: { gun: "ArcheotechLaspistol", fireType: "simple" },
        },
        {
          name: "aimed Laspistol",
          values: { gun: "ArcheotechLaspistol", fireType: "aimed" },
        },
        {
          name: "aimed Plasma",
          values: { gun: "PlasmaPistol", fireType: "aimed" },
        },
        {
          name: "semiAuto: Laspistol",
          values: { gun: "ArcheotechLaspistol", fireType: "semiAuto" },
        },
        {
          name: "semiAuto: PlasmaPistol",
          values: { gun: "PlasmaPistol", fireType: "semiAuto" },
        },
      ]}
      newDatasetFactory={() => ({ gun: "ArcheotechLaspistol", fireType: "simple" })}
      graphFactory={() => new Graph()}
      calculate={values => fireGun(values.gun, values.fireType)}
    />
  );
}
