import { Dice } from "./Dice";

export function d2() {
  return Dice.create(2);
}

export function d4() {
  return Dice.create(4);
}

export function d6() {
  return Dice.create(6);
}

export function d10() {
  return Dice.create(10);
}

export function d12() {
  return Dice.create(12);
}

export function d20() {
  return Dice.create(20);
}

export function d100() {
  return Dice.create(100);
}

export function roll(count: number, sides: number): Dice<number>[] {
  return Array.from({ length: count }, () => Dice.create(sides));
}
