import { Dice } from "../Dice";
import { ProbabilityMap } from "../ProbabilityMap";

export function mapTo<Result, T>(
  dice: Dice<T>,
  mapper: (value: T) => Dice<Result>
): Dice<Result> {
  const result = new ProbabilityMap<Result>((increase) => {
    for (let [value, thisProbability] of dice.probabilities) {
      const dice = mapper(value);

      for (let [otherValue, otherProbability] of dice.probabilities) {
        increase(otherValue, thisProbability * otherProbability);
      }
    }
  });

  return new Dice(result);
}
