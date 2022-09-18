import { Dice } from "./Dice";

export function add(dice: Dice<number>, other: Dice<number>): Dice<number> {
  return Dice.combine(dice, other, (value, otherValue) => {
    return value + otherValue;
  });
}

export function sum(dices: Dice<number>[]): Dice<number> {
  return dices.reduce((prev, current) => add(prev, current));
}

export function getHigherOfTwo(
  dice: Dice<number>,
  other: Dice<number>
): Dice<number> {
  return Dice.combine(dice, other, (value, otherValue) => {
    return Math.max(value, otherValue);
  });
}

export function count(dices: Dice<boolean>[]): Dice<number> {
  return Dice.combineList(dices, (values) => {
    return values.filter(Boolean).length;
  });
}

export function isHigherOrEqual(
  dice: Dice<number>,
  threshold: number
): Dice<boolean> {
  return dice.map((value) => value >= threshold);
}
