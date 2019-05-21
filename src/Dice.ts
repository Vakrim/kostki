import { ProbabilityMap } from "./ProbabilityMap";

export class Dice {
  probabilities: ProbabilityMap<number>;

  constructor(probabilities: ProbabilityMap<number>);
  constructor(sides: number);
  constructor(primitivePossibilites: number[][]);
  constructor(arg: number | ProbabilityMap<number> | number[][]) {
    if (arg instanceof ProbabilityMap) {
      this.probabilities = arg;
    } else if (typeof arg === "number") {
      this.probabilities = new ProbabilityMap(increase => {
        for (let i = 1; i <= arg; i++) {
          increase(i, 1);
        }
      });
    } else {
      this.probabilities = new ProbabilityMap(increase => {
        arg.forEach(probability => {
          increase(probability[0], probability[1]);
        });
      });
    }
  }

  add(other: Dice): Dice {
    return this.combine(other, (value, otherValue) => value + otherValue);
  }

  higher(other: Dice): Dice {
    return this.combine(other, (value, otherValue) =>
      Math.max(value, otherValue)
    );
  }

  higherOrEqual(threshold: number): Dice {
    return this.map(value => (value >= threshold ? 1 : 0));
  }

  when(
    condition: (value: number) => boolean,
    ifTrue: (value: number) => number,
    ifFalse: (value: number) => number
  ): Dice {
    return this.map(value => {
      if (condition(value)) {
        return ifTrue(value);
      } else {
        return ifFalse(value);
      }
    });
  }

  debug() {
    return [...this.probabilities].map(([v, k]) => [k, v]);
  }

  getProbabilityOf(value: number): number {
    return this.probabilities.getProbabilityOf(value);
  }

  private combine(
    other: Dice,
    combiner: (value: number, otherValue: number) => number
  ): Dice {
    const result = new ProbabilityMap<number>(increase => {
      for (let [value, thisCombinations] of this.probabilities) {
        for (let [otherValue, otherCombinations] of other.probabilities) {
          increase(
            combiner(value, otherValue),
            thisCombinations * otherCombinations
          );
        }
      }
    });

    return new Dice(result);
  }

  private map(mapper: (value: number) => number): Dice {
    const result = new ProbabilityMap<number>(increase => {
      for (let [value, thisCombinations] of this.probabilities) {
        increase(mapper(value), thisCombinations);
      }
    });

    return new Dice(result);
  }

  mapTo(mapper: (value: number) => Dice): Dice {
    const result = new ProbabilityMap<number>(increase => {
      for (let [value, thisCombinations] of this.probabilities) {
        const dice = mapper(value);

        for (let [otherValue, otherCombinations] of dice.probabilities) {
          increase(otherValue, thisCombinations * otherCombinations);
        }
      }
    });

    return new Dice(result);
  }
}
