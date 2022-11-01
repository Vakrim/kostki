import { map } from "./operations/map";
import { mapTo } from "./operations/mapTo";
import { ProbabilityMap } from "./ProbabilityMap";

export class Dice<T> {
  readonly probabilities: ProbabilityMap<T>;

  constructor(probabilities: ProbabilityMap<T>);
  constructor(primitivePossibilities: [T, number][]);
  constructor(arg: ProbabilityMap<T> | [T, number][]) {
    if (arg instanceof ProbabilityMap) {
      this.probabilities = arg;
    } else {
      this.probabilities = new ProbabilityMap((increase) => {
        arg.forEach((probability) => {
          increase(probability[0], probability[1]);
        });
      });
    }
  }

  static create(sides: number): Dice<number> {
    const primitivePossibilities: [number, number][] = [];
    for (let i = 1; i <= sides; i++) {
      primitivePossibilities.push([i, 1]);
    }

    return new Dice(primitivePossibilities);
  }

  static always<T>(value: T) {
    return new Dice([[value, 1]]);
  }

  getProbabilityOf(value: T): number {
    return this.probabilities.getProbabilityOf(value);
  }

  map<Result>(mapper: (value: T) => Result): Dice<Result> {
    return map(this, mapper);
  }

  mapTo<Result>(mapper: (value: T) => Dice<Result>): Dice<Result> {
    return mapTo(this, mapper);
  }

  [Symbol.toPrimitive](hint: "string" | "number" | "default") {
    if (hint === "number") {
      throw TypeError("Unexpected conversion to number");
    }
    return [...this.probabilities]
      .map(([v, k]) => `${JSON.stringify(v)} with ${(k * 100).toFixed(2)}%`)
      .join("\n");
  }

  get pairs(): [T, number][] {
    return [...this.probabilities];
  }
}
