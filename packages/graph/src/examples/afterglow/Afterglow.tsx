import { attack } from "./afterglowRoll";
import { getAfterglowGraph } from "./afterglow.graph";
import { Page } from "../../Page";

export function Afterglow() {
  return (
    <Page
      schema={{
        attackDices: "number",
        defenceThreshold: "number",
        weaponDamage: "number",
        headArmour: "number",
        bodyArmour: "number",
        tryAimForHead: "boolean",
      }}
      initalDatasets={[
        {
          name: "aiming for head",
          values: {
            attackDices: 3,
            defenceThreshold: 7,
            weaponDamage: 4,
            headArmour: 6,
            bodyArmour: 9,
            tryAimForHead: true,
          },
        },
        {
          name: "body shot",
          values: {
            attackDices: 3,
            defenceThreshold: 7,
            weaponDamage: 4,
            headArmour: 6,
            bodyArmour: 9,
            tryAimForHead: false,
          },
        },
      ]}
      newDatasetFactory={() => ({
        attackDices: 3,
        defenceThreshold: 7,
        weaponDamage: 4,
        headArmour: 6,
        bodyArmour: 9,
        tryAimForHead: false,
      })}
      graphFactory={getAfterglowGraph}
      calculate={attack}
    />
  );
}
