import { Dice } from "./Dice";

export function add(dice: Dice<number>, other: Dice<number>): Dice<number> {
  return dice.combine(other, (value, otherValue) => {
    return value + otherValue;
  });
}

export function sum(dices: Dice<number>[]): Dice<number> {
  return dices.reduce((prev, current) => add(prev, current));
}

export function higherOfTwo(
  dice: Dice<number>,
  other: Dice<number>
): Dice<number> {
  return dice.combine(other, (value, otherValue) => {
    return Math.max(value, otherValue);
  });
}

export function count(dices: Dice<boolean>[]): Dice<number> {
  return dices.reduce(
    (aDice, bDice) => aDice.combine(bDice, (value, otherValue) => value + (otherValue ? 1 : 0)),
    new Dice<number>([[0, 1]])
  );
}

export function higherOrEqual(
  dice: Dice<number>,
  threshold: number
): Dice<boolean> {
  return dice.map(value => value >= threshold);
}
