import { Dice } from "../Dice";
import { combine } from "./combine";

export function subtractNatural(
  dice: Dice<number>,
  other: Dice<number>
): Dice<number> {
  return combine(dice, other, (value, otherValue) => {
    return Math.max(value - otherValue, 0);
  });
}
