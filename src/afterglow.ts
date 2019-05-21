import { roll } from "./diceFactories";
import { Dice } from "./Dice";

const atackRoll = roll(2, 10)
  .map(dice => dice.higherOrEqual(7))
  .reduce((aDice, bDice) => aDice.add(bDice));

const result = atackRoll.mapTo(numberOfHits => {
  if (numberOfHits === 0) {
    return new Dice([[0, 1]]);
  }
  const damage = roll(numberOfHits, 10)
    .map(dice => dice.higherOrEqual(7))
    .reduce((aDice, bDice) => aDice.add(bDice));
  return damage;
});

console.log(result);