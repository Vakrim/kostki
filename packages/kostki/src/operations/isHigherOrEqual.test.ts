import { d6 } from "../diceFactories";
import { isHigherOrEqual } from "./isHigherOrEqual";

describe(isHigherOrEqual, () => {
  it("checks if values is is higher or equal to given threshold", () => {
    expect(`${[isHigherOrEqual(d6(), 3)]}`).toMatchInlineSnapshot(`
      "false with 33.33%
      true with 66.67%"
    `);
  });
});
