import { Graph } from "../../Graph";
import { Page } from "../../Page";
import { maxOfManyDices } from "./wolsung.graph";

export function Wolsung() {
  return (
    <Page
      schema={{
        numDices: "number",
        rerollOn: "number",
        bonus: "number",
      }}
      initalDatasets={[
        {
          name: "2x(reroll on 9) + 3",
          values: { numDices: 2, rerollOn: 9, bonus: 3 },
        },
        {
          name: "2x(reroll on 8) + 3",
          values: { numDices: 2, rerollOn: 8, bonus: 3 },
        },
        {
          name: "2x(reroll on 9) + 6",
          values: { numDices: 2, rerollOn: 9, bonus: 6 },
        },
        {
          name: "3x(reroll on 8) + 3",
          values: { numDices: 3, rerollOn: 8, bonus: 3 },
        },
        {
          name: "3x(reroll on 9) + 6",
          values: { numDices: 3, rerollOn: 9, bonus: 6 },
        },
      ]}
      newDatasetFactory={() => ({
        numDices: 2,
        rerollOn: 8,
        bonus: 3,
      })}
      graphFactory={() => new Graph()}
      calculate={maxOfManyDices}
    />
  );
}
