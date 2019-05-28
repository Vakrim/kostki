import { Dice } from "./Dice";

export function d2() {
  return Dice.create(2);
}

export function d4() {
  return Dice.create(4);
}

export function d10() {
  return Dice.create(10);
}

export function roll(count: number, sides: number): Dice<number>[] {
  return new Array(count).fill(null).map(() => Dice.create(sides));
}
