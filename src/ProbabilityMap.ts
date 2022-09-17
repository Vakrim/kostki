import { sha1 as hash } from "object-hash";

export class ProbabilityMap<T> {
  private map: Map<T, number> = new Map();
  private valuesCache: Map<string, T> = new Map();
  private sum = 0;

  constructor(
    setter: (increase: (value: T, probability: number) => void) => void
  ) {
    setter((value: T, probability: number) => {
      this.increase(value, probability);
    });
    this.normalizeProbabilites();
  }

  private increase(value: T, probability: number = 1): void {
    const valueRepesantative = this.getRepresentative(value);
    const current = this.map.get(valueRepesantative);
    if (typeof current === "undefined") {
      this.map.set(valueRepesantative, probability);
    } else {
      this.map.set(valueRepesantative, current + probability);
    }
    this.sum += probability;
  }

  private normalizeProbabilites(): void {
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

    const valueHash = hash(value);
    const representative = this.valuesCache.get(valueHash);
    if (typeof representative === "undefined") {
      this.valuesCache.set(valueHash, value);
      return value;
    } else {
      return representative;
    }
  }

  getProbabilityOf(value: T): number {
    return this.map.get(this.getRepresentative(value)) || 0;
  }

  *[Symbol.iterator]() {
    for (let pair of this.map) {
      yield pair;
    }
  }
}
