import { roll as baseRoll } from "../../src/diceFactories";
import { Dice } from "../../src/Dice";
import { count, higherOrEqual } from "../../src/helpers";

function roll(diceCount: number) {
  return {
    andKeepHigherThan(threshold: number) {
      return count(
        baseRoll(diceCount, 10).map((dice) => higherOrEqual(dice, threshold))
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

  return atackRoll
    .mapTo<"miss" | number>((numberOfHits) => {
      if (numberOfHits === 0) {
        return Dice.always("miss");
      } else if (tryAimForHead && numberOfHits >= 3) {
        return roll(numberOfHits - 2 + weaponDamage).andKeepHigherThan(
          headArmour
        );
      } else {
        return roll(numberOfHits + weaponDamage).andKeepHigherThan(bodyArmour);
      }
    })
    .map((damagePoints) => {
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
    })
    .simplify();
}
