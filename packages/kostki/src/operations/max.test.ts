import { d4 } from "../diceFactories";
import { max } from "./max";

describe(max, () => {
  it("returns highest number on dices", () => {
    expect(`${max([d4(), d4()])}`).toMatchInlineSnapshot(`
      "1 with 6.25%
      2 with 18.75%
      3 with 31.25%
      4 with 43.75%"
    `);
  });
});
