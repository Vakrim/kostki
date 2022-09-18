import { Dice } from "../Dice";
import { combineList } from "./combineList";

export function sum(dices: Dice<number>[]): Dice<number> {
  return combineList(dices, (values) => {
    return values.reduce((acc, current) => acc + current, 0);
  });
}
