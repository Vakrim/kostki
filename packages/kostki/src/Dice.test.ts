import { Dice } from "./Dice";
import { d2, d4, roll } from "./diceFactories";
import { add } from "./operations/add";
import { count } from "./operations/count";
import { isHigherOrEqual } from "./operations/isHigherOrEqual";
import { mapTo } from "./operations/mapTo";
import { max } from "./operations/max";

describe(Dice, () => {
  describe("constructor", () => {
    it("creates dice from number", () => {
      const result = Dice.create(2);
      expect(result.getProbabilityOf(1)).toEqual(1 / 2);
      expect(result.getProbabilityOf(2)).toEqual(1 / 2);
    });
  });

  it("adds probabilities", () => {
    const result = add(d2(), d2());

    expect(result.getProbabilityOf(2)).toEqual(1 / 4);
    expect(result.getProbabilityOf(3)).toEqual(2 / 4);
    expect(result.getProbabilityOf(4)).toEqual(1 / 4);
  });

  it("maxes probabilities", () => {
    const result = max([d2(), d2()]);

    expect(result.getProbabilityOf(1)).toEqual(1 / 4);
    expect(result.getProbabilityOf(2)).toEqual(3 / 4);
  });

  it("counts isHigherOrEqual to number", () => {
    const dices = roll(2, 3);

    const result = count(dices.map((dice) => isHigherOrEqual(dice, 2)));

    expect(result.getProbabilityOf(0)).toEqual(1 / 9); // 1,1
    expect(result.getProbabilityOf(1)).toEqual(4 / 9); // 1,2  1,3  2,1  3,1
    expect(result.getProbabilityOf(2)).toEqual(4 / 9); // 2,2  2,3  3,2  3,3
  });

  it("can be mapped to other dices", () => {
    const attackRoll = count(roll(2, 2).map((dice) => isHigherOrEqual(dice, 2)));

    expect(attackRoll.getProbabilityOf(0)).toEqual(1 / 4); // 1,1
    expect(attackRoll.getProbabilityOf(1)).toEqual(2 / 4); // 1,2  2,1
    expect(attackRoll.getProbabilityOf(2)).toEqual(1 / 4); // 2,2

    const result = mapTo(attackRoll, (numberOfHits) => {
      if (numberOfHits === 0) {
        return new Dice([[0, 1]]);
      }
      const damage = count(
        roll(numberOfHits, 2).map((dice) => isHigherOrEqual(dice, 2))
      );
      return damage;
    });

    // 1,1, 1,1 => 0 attacks => 0 damage
    // 1,1, 1,2 => 0 attacks => 0 damage
    // 1,1, 2,1 => 0 attacks => 0 damage
    // 1,1, 2,2 => 0 attacks => 0 damage

    // 1,2, 1,1 => 1 attack => 0 damage
    // 1,2, 1,2 => 1 attack => 0 damage
    // 1,2, 2,1 => 1 attack => 1 damage
    // 1,2, 2,2 => 1 attack => 1 damage

    // 2,1, 1,1 => 1 attack => 0 damage
    // 2,1, 1,2 => 1 attack => 0 damage
    // 2,1, 2,1 => 1 attack => 1 damage
    // 2,1, 2,2 => 1 attack => 1 damage

    // 2,2, 1,1 => 2 attacks => 0 damage
    // 2,2, 1,2 => 2 attacks => 1 damage
    // 2,2, 2,1 => 2 attacks => 1 damage
    // 2,2, 2,2 => 2 attacks => 2 damage

    expect(result.getProbabilityOf(0)).toEqual((4 + 2 + 2 + 1) / 16);
    expect(result.getProbabilityOf(1)).toEqual((2 + 2 + 2) / 16);
    expect(result.getProbabilityOf(2)).toEqual(1 / 16);
  });
});
