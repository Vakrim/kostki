import { Dice } from "../Dice";
import { ProbabilityMap } from "../ProbabilityMap";

export function simplify<T>(dice: Dice<T>, threshold: number = 0.005): Dice<T> {
  const result = new ProbabilityMap<T>((increase) => {
    for (let [value, thisProbability] of dice.probabilities.entries()) {
      if (thisProbability > threshold) {
        increase(value, thisProbability);
      }
    }
  });

  return new Dice<T>(result);
}
