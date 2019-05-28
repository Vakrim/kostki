import { ProbabilityMap } from "./ProbabilityMap";

export class Dice<T extends Primitive> {
  private probabilities: ProbabilityMap<T>;

  constructor(probabilities: ProbabilityMap<T>);
  constructor(primitivePossibilites: [T, number][]);
  constructor(arg: ProbabilityMap<T> | [T, number][]) {
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

  static create(sides: number): Dice<number> {
    const primitivePossibilites: [number, number][] = [];
    for (let i = 1; i <= sides; i++) {
      primitivePossibilites.push([i, 1]);
    }

    return new Dice(primitivePossibilites);
  }

  when<R extends Primitive = Primitive>(
    condition: (value: T) => boolean,
    ifTrue: (value: T) => R,
    ifFalse: (value: T) => R
  ): Dice<R> {
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

  getProbabilityOf(value: T): number {
    return this.probabilities.getProbabilityOf(value);
  }

  combine<G extends Primitive, R extends Primitive>(
    other: Dice<G>,
    combiner: (value: T, otherValue: G) => R
  ): Dice<R> {
    const result = new ProbabilityMap<R>(increase => {
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

  map<G extends Primitive>(mapper: (value: T) => G): Dice<G> {
    const result = new ProbabilityMap<G>(increase => {
      for (let [value, thisCombinations] of this.probabilities) {
        increase(mapper(value), thisCombinations);
      }
    });

    return new Dice<G>(result);
  }

  mapTo<R extends Primitive>(mapper: (value: T) => Dice<R>): Dice<R> {
    const result = new ProbabilityMap<R>(increase => {
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

type Primitive = string | number | boolean;

export function add(dice: Dice<number>, other: Dice<number>): Dice<number> {
  return dice.combine(other, (value, otherValue) => {
    return value + otherValue;
  });
}

export function higherOfTwo(dice: Dice<number>, other: Dice<number>): Dice<number> {
  return dice.combine(other, (value, otherValue) => {
    return Math.max(value, otherValue);
  });
}

export function count(dices: Dice<boolean>[]): Dice<number> {
  return dices.reduce(
    (aDice, bDice) =>
      aDice.combine(bDice, (value, otherValue) => value + (otherValue ? 1 : 0)),
    new Dice<number>([[0, 1]])
  );
}

export function higherOrEqual(
  dice: Dice<number>,
  threshold: number
): Dice<boolean> {
  return dice.map(value => value >= threshold);
}