import { Dice } from "../Dice";
import { combine } from "./combine";

export function reduceWithN<T>(dice: Dice<T>, combiner: (a: T, b: T) => T) {
  const memoized: Dice<T>[] = [dice, dice];

  return function reduceNMemoized(n: number): Dice<T> {
    if (!Number.isInteger(n) || n <= 0) {
      throw TypeError("Expected n to be an integer higher than 0");
    }

    if (n <= memoized.length - 1) {
      return memoized[n]!;
    }

    for (let i = memoized.length; i <= n; i++) {
      memoized[i] = combine(memoized[i - 1]!, dice, combiner);
    }

    return memoized[n]!;
  };
}
