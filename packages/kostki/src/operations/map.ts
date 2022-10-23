import { Dice } from "../Dice";
import { ProbabilityMap } from "../ProbabilityMap";

export function map<Result, T>(dice: Dice<T>, mapper: (value: T) => Result): Dice<Result> {
  const result = new ProbabilityMap<Result>((increase) => {
    for (let [value, thisProbability] of dice.probabilities.entries()) {
      increase(mapper(value), thisProbability);
    }
  });

  return new Dice<Result>(result);
}
