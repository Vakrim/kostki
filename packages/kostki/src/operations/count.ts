import { Dice } from "../Dice";
import { combineList } from "./combineList";

export function count(dices: Dice<boolean>[]): Dice<number> {
  return combineList(dices, (values) => {
    return values.filter(Boolean).length;
  });
}
