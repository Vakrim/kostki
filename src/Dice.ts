export class Dice {
  probabilities: ProbabiltyMap;

  constructor(probabilities: ProbabiltyMap);
  constructor(sides: number);
  constructor(primitivePossibilites: number[][]);
  constructor(arg: number | ProbabiltyMap | number[][]) {
    if (arg instanceof ProbabiltyMap) {
      this.probabilities = arg;
    } else if (typeof arg === "number") {
      this.probabilities = new ProbabiltyMap(increase => {
        for (let i = 1; i <= arg; i++) {
          increase(i, 1);
        }
      });
    } else {
      this.probabilities = new ProbabiltyMap(increase => {
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
    const result = new ProbabiltyMap(increase => {
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
    const result = new ProbabiltyMap(increase => {
      for (let [value, thisCombinations] of this.probabilities) {
        increase(mapper(value), thisCombinations);
      }
    });

    return new Dice(result);
  }

  mapTo(mapper: (value: number) => Dice): Dice {
    const result = new ProbabiltyMap(increase => {
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

class ProbabiltyMap {
  private map: Map<number, number> = new Map();
  private sum = 0;

  constructor(setter: (increase: (value: number, probality: number) => void) => void) {
    setter((value: number, probality: number) => {
      this.increase(value, probality);
    });
    this.normalizeProbabilites();
  }

  private increase(value: number, probality: number = 1): void {
    const current = this.map.get(value);
    if (typeof current === "undefined") {
      this.map.set(value, probality);
    } else {
      this.map.set(value, current + probality);
    }
    this.sum += probality;
  }

  private normalizeProbabilites(): void {
    this.map.forEach((probality, value) => {
      this.map.set(value, probality / this.sum);
    });

    this.sum = 1;
  }

  getProbabilityOf(value: number): number {
    return this.map.get(value) || 0;
  }

  *[Symbol.iterator]() {
    for (let pair of this.map) {
      yield pair;
    }
  }
}
