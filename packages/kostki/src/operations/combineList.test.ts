import { d2 } from "../diceFactories";
import { combineList } from "./combineList";

describe(combineList, () => {
  function sum(list: number[]) {
    return list.reduce((a, b) => a + b, 0);
  }

  it("combines list of dices", () => {
    for (let i = 2; i <= 10; i++) {
      expect(
        combineList(new Array(i).fill(d2()), sum).getProbabilityOf(2 * i)
      ).toEqual(0.5 ** i);

      expect(
        combineList(new Array(i).fill(d2()), sum).getProbabilityOf(i)
      ).toEqual(0.5 ** i);
    }

    expect.assertions(18);
  });
});
