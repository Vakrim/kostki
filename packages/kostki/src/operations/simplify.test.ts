import { d4 } from "../diceFactories";
import { simplify } from "./simplify";
import { sum } from "./sum";

describe(simplify, () => {
  it("removes values with probability lower than given threshold", () => {
    const a = sum([d4(), d4()]);

    expect(`${a}`).toMatchInlineSnapshot(`
      "2 with 6.25%
      3 with 12.50%
      4 with 18.75%
      5 with 25.00%
      6 with 18.75%
      7 with 12.50%
      8 with 6.25%"
    `);

    expect(`${simplify(a, 0.1)}`).toMatchInlineSnapshot(`
      "3 with 14.29%
      4 with 21.43%
      5 with 28.57%
      6 with 21.43%
      7 with 14.29%"
    `);

    expect(`${simplify(a, 0.15)}`).toMatchInlineSnapshot(`
      "4 with 30.00%
      5 with 40.00%
      6 with 30.00%"
    `);
  });
});
