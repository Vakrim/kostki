import { d4 } from "../diceFactories";
import { subtractNatural } from "./subtractNatural";

describe(subtractNatural, () => {
  it("subtracts two numbers on dices. Negative results are converted to 0", () => {
    expect(`${subtractNatural(d4(), d4())}`).toMatchInlineSnapshot(`
      "0 with 62.50%
      1 with 18.75%
      2 with 12.50%
      3 with 6.25%"
    `);
  });
});
