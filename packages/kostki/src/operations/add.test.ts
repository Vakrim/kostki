import { d4, d6 } from "../diceFactories";
import { add } from "./add";

describe(add, () => {
  it("adds numbers", () => {
    expect(`${add(d4(), d6())}`).toMatchInlineSnapshot(`
      "2 with 4.17%
      3 with 8.33%
      4 with 12.50%
      5 with 16.67%
      6 with 16.67%
      7 with 16.67%
      8 with 12.50%
      9 with 8.33%
      10 with 4.17%"
    `);
  });
});
