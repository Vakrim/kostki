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

const atackRoll = roll(3).andKeepHigherThan(7);

const weaponDamage = 4;

const damageRoll = atackRoll
  .mapTo<"miss" | number>(numberOfHits => {
    if (numberOfHits === 0) {
      return Dice.always("miss");
    } else if (numberOfHits >= 3) {
      return roll(numberOfHits - 2 + weaponDamage).andKeepHigherThan(6);
    } else {
      return roll(numberOfHits + weaponDamage).andKeepHigherThan(9);
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
  });

console.log(damageRoll);
