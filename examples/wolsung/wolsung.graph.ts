import { Graph } from "../../graph/Graph";
import { Dice } from "../../src/Dice";
import { d10, roll } from "../../src/diceFactories";
import { higherOfTwo } from "../../src/helpers";

const graph = new Graph();

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
      throw "fock";
    }

    roll = roll
      .combine(d10(), (accumulatorDice, nextRoll) => {
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
      })
      .simplify(0.0001);
  }

  return roll.map((v) => v.value + bonus);
}

const test9 = test(9, 3);
const test8 = test(8, 3);

function twoDices(dice: Dice<number>) {
  return higherOfTwo(dice, dice)
}

function threeDices(dice: Dice<number>) {
  return higherOfTwo(dice, twoDices(dice));
}

graph.addDataset("2x(reroll on 9) + 3", twoDices(test9));
graph.addDataset("2x(reroll on 8) + 3", twoDices(test8));
graph.addDataset("2x(reroll on 9) + 6", twoDices(test(9, 6)));
graph.addDataset("3x(reroll on 8) + 3", threeDices(test8));
graph.addDataset("3x(reroll on 9) + 6", threeDices(test(9, 6)));


graph.saveToFile(__dirname + "/graph.html");