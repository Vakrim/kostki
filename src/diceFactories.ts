import { Dice } from "./Dice";

export function d2() {
  return new Dice(2);
}

export function d4() {
  return new Dice(4);
}

export function d10() {
  return new Dice(10);
}

export function roll(count: number, sides: number): Dice[] {
  return new Array(count).fill(null).map(() => new Dice(sides));
}
