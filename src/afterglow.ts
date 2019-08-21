import { roll as baseRoll } from "./diceFactories";
import { Dice, add, count, higherOrEqual } from "./Dice";

function roll(diceCount: number) {
  return {
    andKeepHigherThan(threshold: number) {
      return count(
        baseRoll(diceCount, 10).map(dice => higherOrEqual(dice, threshold))
      );
    }
  };
}

function attack({
  attackDices,
  defenceThreshold,
  weaponDamage,
  headArmour,
  bodyArmour,
  tryAimForHead = true
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
    .mapTo<"miss" | number>(numberOfHits => {
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
    .map(damagePoints => {
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

console.log(
  'Try aim for head\n',
  attack({
    attackDices: 3,
    defenceThreshold: 7,
    weaponDamage: 4,
    headArmour: 6,
    bodyArmour: 9,
    tryAimForHead: true
  }).toString()
);

console.log(
  'Body shoot\n',
  attack({
    attackDices: 3,
    defenceThreshold: 7,
    weaponDamage: 4,
    headArmour: 6,
    bodyArmour: 9,
    tryAimForHead: false
  }).toString()
);
