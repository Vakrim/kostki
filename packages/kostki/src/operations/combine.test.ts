import { d2 } from "../diceFactories";
import { combine } from "./combine";

describe(combine, () => {
  it("combines 2 dices", () => {
    const result = combine(d2(), d2(), sum);

    expect(result.getProbabilityOf(2 * 2)).toEqual(0.5 ** 2);
    expect(result.getProbabilityOf(2)).toEqual(0.5 ** 2);
  });

  it("combines 3 dices", () => {
    const result = combine(d2(), d2(), d2(), sum);

    expect(result.getProbabilityOf(2 * 3)).toEqual(0.5 ** 3);
    expect(result.getProbabilityOf(3)).toEqual(0.5 ** 3);
  });

  it("combines 4 dices", () => {
    const result = combine(d2(), d2(), d2(), d2(), sum);

    expect(result.getProbabilityOf(2 * 4)).toEqual(0.5 ** 4);
    expect(result.getProbabilityOf(4)).toEqual(0.5 ** 4);
  });

  it("combines 4 dices", () => {
    const result = combine(d2(), d2(), d2(), d2(), d2(), sum);

    expect(result.getProbabilityOf(2 * 5)).toEqual(0.5 ** 5);
    expect(result.getProbabilityOf(5)).toEqual(0.5 ** 5);
  });

  it("combines 6 dices", () => {
    const result = combine(d2(), d2(), d2(), d2(), d2(), d2(), sum);

    expect(result.getProbabilityOf(2 * 6)).toEqual(0.5 ** 6);
    expect(result.getProbabilityOf(6)).toEqual(0.5 ** 6);
  });

  it("throws at 7 dices", () => {
    // @ts-expect-error
    expect(() => combine(d2(), d2(), d2(), d2(), d2(), d2(), d2(), sum)).toThrowError('unexpected number of arguments in combine');
  });
});

function sum(...list: number[]) {
  return list.reduce((a, b) => a + b, 0);
}
