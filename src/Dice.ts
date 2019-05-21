import { ProbabilityMap } from "./ProbabilityMap";

class GenericDice<T extends number | string> {
  probabilities: ProbabilityMap<T>;
}

export class Dice extends GenericDice<number> {
  constructor(probabilities: ProbabilityMap<number>);
  constructor(primitivePossibilites: number[][]);
  constructor(arg: ProbabilityMap<number> | number[][]) {
    super();

    if (arg instanceof ProbabilityMap) {
      this.probabilities = arg;
    } else {
      this.probabilities = new ProbabilityMap(increase => {
        arg.forEach(probability => {
          increase(probability[0], probability[1]);
        });
      });
    }
  }

  static create(sides: number): Dice {
    const primitivePossibilites = [];
    for (let i = 1; i <= sides; i++) {
      primitivePossibilites.push([i, 1]);
    }

    return new Dice(primitivePossibilites);
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
