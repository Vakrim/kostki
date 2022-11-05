import { Dice } from "../Dice";
import { d2, d4 } from "../diceFactories";
import { combineState } from "./combineState";

describe(combineState, () => {
  it("combines state conditionally", () => {
    const add = jest.fn((a: number, b: number) => a * 10 + b);

    const result = combineState(d4(), d4(), (x) => x > 2, add);

    expect(`${result.state}`).toMatchInlineSnapshot(`
      "1 with 25.00%
      2 with 25.00%
      31 with 6.25%
      32 with 6.25%
      33 with 6.25%
      34 with 6.25%
      41 with 6.25%
      42 with 6.25%
      43 with 6.25%
      44 with 6.25%"
    `);

    expect(result.every).toEqual(false);
    expect(result.some).toEqual(true);

    expect(add).toHaveBeenCalledTimes(4 * 2);
  });

  it("combines state conditionally for from 2 to 6 dices", () => {
    for (let i = 2; i <= 6; i++) {
      const dices = new Array<Dice<number>>(i).fill(d4()) as [
        Dice<number>,
        Dice<number>,
        Dice<number>
      ];

      const result = combineState(...dices, (x: number) => x > 2, sum);

      expect(result.state.getProbabilityOf(1)).toEqual(0.25);

      expect(result.state.getProbabilityOf(i * 4)).toEqual(0.25 ** i);
    }
  });

  it("throws at 7 dices", () => {
    expect(() =>
      combineState(
        // @ts-expect-error
        d2(),
        d2(),
        d2(),
        d2(),
        d2(),
        d2(),
        d2(),
        (x: number) => x === 1,
        sum
      )
    ).toThrowError("unexpected number of arguments in combine");
  });
});

const sum = (...n: number[]) => n.reduce((a, b) => a + b, 0);
