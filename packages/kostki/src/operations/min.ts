import { Dice } from "../Dice";
import { reduceList } from "./reduceList";

export function min(dices: Dice<number>[]): Dice<number> {
  return reduceList(dices, (previous, current) => {
    return Math.min(previous, current);
  });
}
