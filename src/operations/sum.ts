import { Dice } from "../Dice";
import { reduceList } from "./reduceList";

export function sum(dices: Dice<number>[]): Dice<number> {
  return reduceList(dices, (prev, current) => {
    return prev + current;
  });
}
