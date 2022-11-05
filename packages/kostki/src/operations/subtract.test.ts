import { d4 } from "../diceFactories";
import { subtract } from "./subtract";

describe(subtract, () => {
  it("subtracts two numbers on dices", () => {
    expect(`${subtract(d4(), d4())}`).toMatchInlineSnapshot(`
      "0 with 25.00%
      -1 with 18.75%
      -2 with 12.50%
      -3 with 6.25%
      1 with 18.75%
      2 with 12.50%
      3 with 6.25%"
    `);
  });
});
