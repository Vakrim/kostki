import { Dice } from "../Dice";
import { ProbabilityMap } from "../ProbabilityMap";

export function combine<R, G1, G2>(
  dice: Dice<G1>,
  dice2: Dice<G2>,
  combiner: (d1: G1, d2: G2) => R
): Dice<R> {
  const result = new ProbabilityMap<R>((increase) => {
    for (const a of dice.pairs) {
      for (const b of dice2.pairs) {
        increase(combiner(a[0], b[0]), a[1] * b[1]);
      }
    }
  });

  return new Dice(result);
}
