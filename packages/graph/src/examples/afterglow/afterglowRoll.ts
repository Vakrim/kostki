import {
  count,
  Dice,
  isHigherOrEqual,
  map,
  mapTo,
  simplify,
  roll as baseRoll,
} from "kostki";

function roll(diceCount: number) {
  return {
    andKeepHigherThan(threshold: number) {
      return count(
        baseRoll(diceCount, 10).map((dice) => isHigherOrEqual(dice, threshold))
      );
    },
  };
}

export function attack({
  attackDices,
  defenceThreshold,
  weaponDamage,
  headArmour,
  bodyArmour,
  tryAimForHead = true,
}: {
  attackDices: number;
  defenceThreshold: number;
  weaponDamage: number;
  headArmour: number;
  bodyArmour: number;
  tryAimForHead?: boolean;
}) {
  const atackRoll = roll(attackDices).andKeepHigherThan(defenceThreshold);

  const hit = mapTo(atackRoll, (numberOfHits): Dice<"miss" | number> => {
    if (numberOfHits === 0) {
      return Dice.always("miss" as const);
    } else if (tryAimForHead && numberOfHits >= 3) {
      return roll(numberOfHits - 2 + weaponDamage).andKeepHigherThan(
        headArmour
      );
    } else {
      return roll(numberOfHits + weaponDamage).andKeepHigherThan(bodyArmour);
    }
  });

  const damage = map(hit, (damagePoints) => {
    if (damagePoints === "miss" || damagePoints === 0) {
      return "no damage";
    } else if (damagePoints <= 2) {
      return "light wound";
    } else if (damagePoints <= 4) {
      return "severe wound";
    } else if (damagePoints <= 5) {
      return "critical wound";
    } else {
      return "fatal wound";
    }
  });

  return simplify(damage);
}
