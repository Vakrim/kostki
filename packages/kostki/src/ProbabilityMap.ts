import { stableStringify } from "./stableStringify";

export class ProbabilityMap<T> {
  private map: Map<T, number> = new Map();
  private stringifiedValues: Map<T, string> = new Map();
  private valuesCache: Map<string, T> = new Map();
  private sum = 0;

  constructor(
    setter: (increase: (value: T, probability: number) => void) => void
  ) {
    setter((value: T, probability: number) => {
      this.increase(value, probability);
    });
    this.stringifiedValues.clear();
    this.normalizeProbabilities();
  }

  private increase(value: T, probability: number = 1): void {
    const valueRepresentative = this.getRepresentative(value);
    const current = this.map.get(valueRepresentative);
    if (typeof current === "undefined") {
      this.map.set(valueRepresentative, probability);
    } else {
      this.map.set(valueRepresentative, current + probability);
    }
    this.sum += probability;
  }

  private normalizeProbabilities(): void {
    this.map.forEach((probability, valueHash) => {
      this.map.set(valueHash, probability / this.sum);
    });
    this.sum = 1;
  }

  private getRepresentative(value: T): T {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint" ||
      value === null ||
      value === undefined
    ) {
      return value;
    }

    const valueSerialized = this.getSerialized(value);
    const representative = this.valuesCache.get(valueSerialized);
    if (typeof representative === "undefined") {
      this.valuesCache.set(valueSerialized, value);
      return value;
    } else {
      return representative;
    }
  }

  private getSerialized(value: T & {}): string {
    const stringifiedBefore = this.stringifiedValues.get(value);

    if (stringifiedBefore !== undefined) {
      return stringifiedBefore;
    }

    const stringified = stableStringify(value);

    this.stringifiedValues.set(value, stringified);

    return stringified;
  }

  getProbabilityOf(value: T): number {
    return this.map.get(this.getRepresentative(value)) ?? 0;
  }

  *[Symbol.iterator]() {
    for (let pair of this.map) {
      yield pair;
    }
  }
}
