import { Dice } from "../Dice";
import { combineList } from "./combineList";

export function combine<R, G1>(dice: Dice<G1>, combiner: (d1: G1) => R): Dice<R>;
export function combine<R, G1, G2>(
  dice: Dice<G1>,
  dice2: Dice<G2>,
  combiner: (d1: G1, d2: G2) => R
): Dice<R>;
export function combine<R, G1, G2, G3>(
  dice: Dice<G1>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  combiner: (d1: G1, d2: G2, d3: G3) => R
): Dice<R>;
export function combine<R, G1, G2, G3, G4>(
  dice: Dice<G1>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  combiner: (d1: G1, d2: G2, d3: G3, d4: G4) => R
): Dice<R>;
export function combine<R, G1, G2, G3, G4, G5>(
  dice: Dice<G1>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  dice5: Dice<G5>,
  combiner: (d1: G1, d2: G2, d3: G3, d4: G4, d5: G5) => R
): Dice<R>;
export function combine<R, G1, G2, G3, G4, G5, G6>(
  dice: Dice<G1>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  dice5: Dice<G5>,
  dice6: Dice<G6>,
  combiner: (d1: G1, d2: G2, d3: G3, d4: G4, d5: G5, d6: G6) => R
): Dice<R>;
export function combine<R>(...args: unknown[]): Dice<R> {
  const combiner = args.pop();

  if (typeof combiner !== "function") {
    throw new TypeError(
      "Last argument of combine is expected to be a function"
    );
  }

  const dices: Dice<unknown>[] = args.map((arg) => {
    if (!(arg instanceof Dice)) {
      throw new TypeError(
        "All arguments besides last one are expected to be a instance of Dice"
      );
    }
    return arg;
  });

  return combineList(dices, (d) => combiner(...d));
}
