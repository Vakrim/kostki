import { Dice } from "../Dice";
import { map } from "./map";

export function isHigherOrEqual(
  dice: Dice<number>,
  threshold: number
): Dice<boolean> {
  return map(dice, (value) => value >= threshold);
}
