import { Dice } from "../Dice";
import { reduceList } from "./reduceList";

export function count(dices: Dice<boolean>[]): Dice<number> {
  return reduceList(
    dices,
    (prev, current) => {
      return current ? prev + 1 : prev;
    },
    0
  );
}
