import { d4 } from "../diceFactories";
import { reduceWithN } from "./reduceWithN";

describe(reduceWithN, () => {
  it("reduces number of dices by combining them", () => {
    const combiner = jest.fn((a: number, b: number) => Math.max(a, b));

    const highest = reduceWithN(d4(), combiner);

    expect(`${highest(1)}`).toMatchInlineSnapshot(`
      "1 with 25.00%
      2 with 25.00%
      3 with 25.00%
      4 with 25.00%"
    `);

    expect(combiner).toHaveBeenCalledTimes(0);

    expect(`${highest(2)}`).toMatchInlineSnapshot(`
      "1 with 6.25%
      2 with 18.75%
      3 with 31.25%
      4 with 43.75%"
    `);

    expect(combiner).toHaveBeenCalledTimes(16);

    expect(`${highest(3)}`).toMatchInlineSnapshot(`
      "1 with 1.56%
      2 with 10.94%
      3 with 29.69%
      4 with 57.81%"
    `);

    expect(combiner).toHaveBeenCalledTimes(2 * 16);

    expect(`${highest(5)}`).toMatchInlineSnapshot(`
      "1 with 0.10%
      2 with 3.03%
      3 with 20.61%
      4 with 76.27%"
    `);

    expect(combiner).toHaveBeenCalledTimes(4 * 16);

    expect(`${highest(4)}`).toMatchInlineSnapshot(`
      "1 with 0.39%
      2 with 5.86%
      3 with 25.39%
      4 with 68.36%"
    `);

    expect(combiner).toHaveBeenCalledTimes(4 * 16);
  });
});
