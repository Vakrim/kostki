import { combineNested } from "../combineNested";
import { Dice } from "../Dice";
import { ProbabilityMap } from "../ProbabilityMap";

export function combineList<Result, T>(
  dices: Dice<T>[],
  combiner: (d: T[]) => Result
): Dice<Result> {
  const result = new ProbabilityMap<Result>((increase) => {
    combineNested(
      (...pairs) => {
        increase(
          combiner(pairs.map(([value]) => value)),
          pairs.reduce((acc, [, probability]) => acc * probability, 1)
        );
      },
      dices.map((d) => d.probabilities)
    );
  });

  return new Dice(result);
}
