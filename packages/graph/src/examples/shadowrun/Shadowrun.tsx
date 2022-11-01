import { Graph } from "../../Graph";
import { Page } from "../../Page";
import { registerSprite, Result, State } from "./calculations";

export function Shadowrun() {
  return (
    <Page
      schema={{
        resonance: "number",
        compiling: "number",
        registering: "number",
        spriteLevel: "number",
        fadingResistance: "number",
        stunRecovery: "number",
        hoursOfOperation: "number",
      }}
      initialDatasets={[
        {
          name: "_HanCoF",
          values: {
            resonance: 6,
            compiling: 6,
            registering: 6,
            spriteLevel: 6,
            fadingResistance: 14,
            stunRecovery: 8,
            hoursOfOperation: 3,
          },
        },
      ]}
      newDatasetFactory={() => ({
        resonance: 6,
        compiling: 6,
        registering: 6,
        spriteLevel: 6,
        fadingResistance: 14,
        stunRecovery: 8,
        hoursOfOperation: 3,
      })}
      graphFactory={() =>
        new Graph<Result>((a, b) => pointsOfState(a) - pointsOfState(b))
      }
      calculate={registerSprite}
      drawGraphs={true}
    />
  );
}

function pointsOfState(state: Result) {
  return (
    state.registered.reduce((a, b) => a + b.tasks, 0) * 100 +
    (state.compiledSprite ? state.compiledSprite.tasks * 10 : 0) -
    state.stunDamage
  );
}
