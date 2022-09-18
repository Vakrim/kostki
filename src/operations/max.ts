import { Dice } from "../Dice";
import { combineList } from "./combineList";

export function max(dices: Dice<number>[]): Dice<number> {
  return combineList(dices, (values) => {
    return Math.max(...values);
  });
}
