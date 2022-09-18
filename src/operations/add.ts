import { Dice } from "../Dice";
import { combine } from "./combine";

export function add(dice: Dice<number>, other: Dice<number>): Dice<number> {
  return combine(dice, other, (value, otherValue) => {
    return value + otherValue;
  });
}
