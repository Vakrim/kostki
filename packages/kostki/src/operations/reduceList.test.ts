import { d10 } from "../diceFactories";
import { reduceList } from "./reduceList";

describe(reduceList, () => {
  it("reduces list of dices by combining them", () => {
    const add = jest.fn((a: number, b: number) => a + b);

    const sum = reduceList([d10(), d10(), d10(), d10()], add);

    expect(add).toHaveBeenCalledTimes(
      10 * 10 + (20 - 2 + 1) * 10 + (30 - 3 + 1) * 10
    );

    expect(`${sum}`).toMatchInlineSnapshot(`
      "4 with 0.01%
      5 with 0.04%
      6 with 0.10%
      7 with 0.20%
      8 with 0.35%
      9 with 0.56%
      10 with 0.84%
      11 with 1.20%
      12 with 1.65%
      13 with 2.20%
      14 with 2.82%
      15 with 3.48%
      16 with 4.15%
      17 with 4.80%
      18 with 5.40%
      19 with 5.92%
      20 with 6.33%
      21 with 6.60%
      22 with 6.70%
      23 with 6.60%
      24 with 6.33%
      25 with 5.92%
      26 with 5.40%
      27 with 4.80%
      28 with 4.15%
      29 with 3.48%
      30 with 2.82%
      31 with 2.20%
      32 with 1.65%
      33 with 1.20%
      34 with 0.84%
      35 with 0.56%
      36 with 0.35%
      37 with 0.20%
      38 with 0.10%
      39 with 0.04%
      40 with 0.01%"
    `);
  });
});
