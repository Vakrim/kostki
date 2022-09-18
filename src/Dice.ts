import { ProbabilityMap } from "./ProbabilityMap";
import { combineNested } from "./combineNested";

export class Dice<T> {
  private probabilities: ProbabilityMap<T>;

  constructor(probabilities: ProbabilityMap<T>);
  constructor(primitivePossibilites: [T, number][]);
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
    const primitivePossibilites: [number, number][] = [];
    for (let i = 1; i <= sides; i++) {
      primitivePossibilites.push([i, 1]);
    }

    return new Dice(primitivePossibilites);
  }

  static always<T>(value: T) {
    return new Dice([[value, 1]]);
  }

  static combine<G1, R>(dice: Dice<G1>, combiner: (d1: G1) => R): Dice<R>;
  static combine<G1, G2, R>(
    dice: Dice<G1>,
    dice2: Dice<G2>,
    combiner: (d1: G1, d2: G2) => R
  ): Dice<R>;
  static combine<G1, G2, G3, R>(
    dice: Dice<G1>,
    dice2: Dice<G2>,
    dice3: Dice<G3>,
    combiner: (d1: G1, d2: G2, d3: G3) => R
  ): Dice<R>;
  static combine<G1, G2, G3, G4, R>(
    dice: Dice<G1>,
    dice2: Dice<G2>,
    dice3: Dice<G3>,
    dice4: Dice<G4>,
    combiner: (d1: G1, d2: G2, d3: G3, d4: G4) => R
  ): Dice<R>;
  static combine<G1, G2, G3, G4, G5, R>(
    dice: Dice<G1>,
    dice2: Dice<G2>,
    dice3: Dice<G3>,
    dice4: Dice<G4>,
    dice5: Dice<G5>,
    combiner: (d1: G1, d2: G2, d3: G3, d4: G4, d5: G5) => R
  ): Dice<R>;
  static combine<G1, G2, G3, G4, G5, G6, R>(
    dice: Dice<G1>,
    dice2: Dice<G2>,
    dice3: Dice<G3>,
    dice4: Dice<G4>,
    dice5: Dice<G5>,
    dice6: Dice<G6>,
    combiner: (d1: G1, d2: G2, d3: G3, d4: G4, d5: G5, d6: G6) => R
  ): Dice<R>;
  static combine<R>(...args: unknown[]): Dice<R> {
    const combiner = args.pop();

    if (typeof combiner !== "function") {
      throw new TypeError(
        "Last arguement of combine is expected to be a function"
      );
    }

    const dices: Dice<unknown>[] = args.map((arg) => {
      if (!(arg instanceof Dice)) {
        throw new TypeError(
          "All arguments besides last one are expected to be a instance of Dice"
        );
      }
      return arg;
    });

    return this.combineList(dices, (d) => combiner(...d));
  }

  static combineList<G, R>(dices: Dice<G>[], combiner: (d: G[]) => R): Dice<R> {
    const result = new ProbabilityMap<R>((increase) => {
      combineNested(
        (...pairs) => {
          increase(
            combiner(pairs.map(([value]) => value)),
            pairs.reduce((acc, [, probability]) => acc * probability, 1)
          );
        },
        dices.map((d) => d.probabilities)
      );
    });

    return new Dice(result);
  }

  when<R>(
    condition: (value: T) => boolean,
    ifTrue: (value: T) => R,
    ifFalse: (value: T) => R
  ): Dice<R> {
    return this.map((value) => {
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

  map<G>(mapper: (value: T) => G): Dice<G> {
    const result = new ProbabilityMap<G>((increase) => {
      for (let [value, thisProbability] of this.probabilities) {
        increase(mapper(value), thisProbability);
      }
    });

    return new Dice<G>(result);
  }

  mapTo<R>(mapper: (value: T) => Dice<R>): Dice<R> {
    const result = new ProbabilityMap<R>((increase) => {
      for (let [value, thisProbability] of this.probabilities) {
        const dice = mapper(value);

        for (let [otherValue, otherProbability] of dice.probabilities) {
          increase(otherValue, thisProbability * otherProbability);
        }
      }
    });

    return new Dice(result);
  }

  simplify(threshold: number = 0.005): Dice<T> {
    const result = new ProbabilityMap<T>((increase) => {
      for (let [value, thisProbability] of this.probabilities) {
        if (thisProbability > threshold) {
          increase(value, thisProbability);
        }
      }
    });

    return new Dice<T>(result);
  }

  toString(): string {
    return [...this.probabilities]
      .map(([v, k]) => `${JSON.stringify(v)} with ${(k * 100).toFixed(2)}%`)
      .join("\n");
  }

  get pairs(): [T, number][] {
    return [...this.probabilities];
  }
}
