import { d10, simplify, combine, max, Dice } from "kostki";

function test(explodingThreshold: number, bonus: number) {
  let roll = d10().map((v) => {
    const isExploding = v >= explodingThreshold;

    return {
      value: isExploding ? 10 : v,
      isExploding,
    };
  });

  let x = 100;

  while (roll.pairs.some(([rollResult]) => rollResult.isExploding)) {
    x--;
    if (x < 0) {
      throw new Error("Still exploding dices...");
    }

    roll = simplify(
      combine(roll, d10(), (accumulatorDice, nextRoll) => {
        if (!accumulatorDice.isExploding) {
          return {
            ...accumulatorDice,
          };
        }

        const isExploding = nextRoll >= explodingThreshold;

        return {
          value: accumulatorDice.value + (isExploding ? 10 : nextRoll),
          isExploding,
        };
      }),
      0.0001
    );
  }

  return roll.map((v) => v.value + bonus);
}

const memoized = new Map<string, Dice<number>>();

function memoizeTest(explodingThreshold: number, bonus: number) {
  const key = getTestKey(explodingThreshold, bonus);

  const cached = memoized.get(key);

  if (cached) {
    return cached;
  }

  const computed = test(explodingThreshold, bonus);

  memoized.set(key, computed);

  return computed;
}

function getTestKey(explodingThreshold: number, bonus: number) {
  return [explodingThreshold, bonus].join("-");
}

export function maxOfManyDices({
  rerollOn,
  bonus,
  numDices,
}: {
  rerollOn: number;
  bonus: number;
  numDices: number;
}) {
  const dice = memoizeTest(rerollOn, bonus);

  return max(Array(numDices).fill(dice));
}
