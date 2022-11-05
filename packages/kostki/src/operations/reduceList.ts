import { Dice } from "../Dice";
import { combine } from "./combine";

export function reduceList<T>(
  dices: Dice<T>[],
  combiner: (prev: T, current: T) => T
): Dice<T>;
export function reduceList<Result, T>(
  dices: Dice<T>[],
  combiner: (prev: Result, current: T) => Result,
  initialValue: Result
): Dice<Result>;
export function reduceList<Result, T>(
  dices: Dice<T>[],
  combiner: (prev: Result, current: T) => Result,
  initialValue?: Result
): Dice<T | Result> {
  if (dices.length < 1) {
    throw new TypeError("reduceList expects at least 1 element in list");
  }

  if (initialValue !== undefined) {
    const initialDice: Dice<Result> = Dice.always(initialValue);

    return dices.reduce((prevDice, currentDice): Dice<Result> => {
      return combine(prevDice, currentDice, combiner);
    }, initialDice);
  } else {
    if (dices.length === 1) {
      return dices[0]!;
    }

    const combi = combiner as (prev: unknown, current: T) => unknown as (
      prev: T,
      current: T
    ) => T;

    return dices.reduce((prevDice, currentDice): Dice<T> => {
      return combine(prevDice, currentDice, combi);
    });
  }
}
