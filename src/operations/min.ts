import { Dice } from "../Dice";
import { combineList } from "./combineList";

export function min(dices: Dice<number>[]): Dice<number> {
  return combineList(dices, (values) => {
    return Math.min(...values);
  });
}
