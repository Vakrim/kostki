import { Dice } from "../Dice";
import { reduceList } from "./reduceList";

export function max(dices: Dice<number>[]): Dice<number> {
  return reduceList(dices, (previous, current) => {
    return Math.max(previous, current);
  });
}
