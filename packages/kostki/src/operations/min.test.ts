import { d4 } from "../diceFactories";
import { min } from "./min";

describe(min, () => {
  it("returns lowest number on dices", () => {
    expect(`${min([d4(), d4()])}`).toMatchInlineSnapshot(`
      "1 with 43.75%
      2 with 31.25%
      3 with 18.75%
      4 with 6.25%"
    `);
  });
});
