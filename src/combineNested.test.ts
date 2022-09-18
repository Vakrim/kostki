import { combineNested, combineNestedGen } from "./combineNested";

describe(combineNested, () => {
  const callback = jest.fn();

  combineNested(callback, [
    [1, 2],
    [3, 4],
  ]);

  expect(callback.mock.calls).toEqual([
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
  ]);
});

describe(combineNestedGen, () => {
  it("yields all combinations from arrays", () => {
    expect(
      Array.from(
        combineNestedGen([
          [1, 2],
          [3, 4, 5],
        ])
      )
    ).toEqual([
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 4],
      [2, 5],
    ]);

    expect(Array.from(combineNestedGen([[1], [3, 4], [5, 6]]))).toEqual([
      [1, 3, 5],
      [1, 3, 6],
      [1, 4, 5],
      [1, 4, 6],
    ]);
  });
});
