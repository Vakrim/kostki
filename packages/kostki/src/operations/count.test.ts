import { d6 } from "../diceFactories";
import { count } from "./count";
import { isHigherOrEqual } from "./isHigherOrEqual";

describe(count, () => {
  it("counts true values", () => {
    expect(`${count([isHigherOrEqual(d6(), 3)])}`).toMatchInlineSnapshot(`
      "0 with 33.33%
      1 with 66.67%"
    `);

    expect(`${count([isHigherOrEqual(d6(), 3), isHigherOrEqual(d6(), 3)])}`)
      .toMatchInlineSnapshot(`
      "0 with 11.11%
      1 with 44.44%
      2 with 44.44%"
    `);
  });
});
