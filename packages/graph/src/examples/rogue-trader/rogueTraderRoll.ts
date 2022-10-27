import { Dice, d100 } from "kostki";

export const FAIL = Symbol();
export const SUCCESS = Symbol();

export function rollTest(threshold: number): Dice<RollResult> {
  return d100().map(rolled => {
    if (rolled > threshold) {
      return {
        type: FAIL,
        DoF: Math.floor((rolled - threshold) / 10)
      };
    } else {
      return {
        DoS: Math.floor((threshold - rolled) / 10),
        type: SUCCESS
      };
    }
  });
}

export function enemy(armor: number) {
  return function(hitpoints: number, penetration: number) {
    const penetratedArmor = Math.max(0, armor - penetration);
    return Math.max(0, hitpoints - penetratedArmor);
  };
}

interface RollFailResult {
  type: typeof FAIL;
  DoF: number;
}

interface RollSuccessResult {
  type: typeof SUCCESS;
  DoS: number;
}

type RollResult = RollFailResult | RollSuccessResult;
