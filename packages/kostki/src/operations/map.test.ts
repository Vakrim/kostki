import { d4 } from "../diceFactories";
import { map } from "./map";

describe(map, () => {
  it("maps dices to new dice", () => {
    expect(`${map(d4(), (n) => `doubled ${n} is equal to ${n * 2}`)}`)
      .toMatchInlineSnapshot(`
      ""doubled 1 is equal to 2" with 25.00%
      "doubled 2 is equal to 4" with 25.00%
      "doubled 3 is equal to 6" with 25.00%
      "doubled 4 is equal to 8" with 25.00%"
    `);

    expect(`${map(d4(), (n) => n % 3)}`).toMatchInlineSnapshot(`
      "1 with 50.00%
      2 with 25.00%
      0 with 25.00%"
    `);
  });
});
