import { d12, d2, d4, d6 } from "../diceFactories";
import { mapTo } from "./mapTo";

describe(mapTo, () => {
  it("maps dices to new dice", () => {
    expect(`${mapTo(d2(), (n) => (n === 1 ? d6() : d12()))}`)
      .toMatchInlineSnapshot(`
      "1 with 12.50%
      2 with 12.50%
      3 with 12.50%
      4 with 12.50%
      5 with 12.50%
      6 with 12.50%
      7 with 4.17%
      8 with 4.17%
      9 with 4.17%
      10 with 4.17%
      11 with 4.17%
      12 with 4.17%"
    `);
  });
});
