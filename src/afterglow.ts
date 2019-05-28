import { roll } from "./diceFactories";
import { Dice, add, count, higherOrEqual } from "./Dice";

const atackRoll = count(roll(2, 10).map(dice => higherOrEqual(dice, 7)));

const result = atackRoll.mapTo<string | number>(numberOfHits => {
  if (numberOfHits === 0) {
    return new Dice([["miss", 1]]);
  }
  const damage = count(
    roll(numberOfHits, 10).map(dice => higherOrEqual(dice, 7))
  );
  return damage;
});

console.log(result);
