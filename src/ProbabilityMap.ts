import * as hash from "object-hash";

export class ProbabilityMap<T extends any> {
  private map: Map<T, number> = new Map();
  private valuesCache: Map<string, T> = new Map();
  private sum = 0;

  constructor(
    setter: (increase: (value: T, probality: number) => void) => void
  ) {
    setter((value: T, probality: number) => {
      this.increase(value, probality);
    });
    this.normalizeProbabilites();
  }

  private increase(value: T, probality: number = 1): void {
    const valueRepesantative = this.getRepresentative(value);
    const current = this.map.get(valueRepesantative);
    if (typeof current === "undefined") {
      this.map.set(valueRepesantative, probality);
    } else {
      this.map.set(valueRepesantative, current + probality);
    }
    this.sum += probality;
  }

  private normalizeProbabilites(): void {
    this.map.forEach((probality, valueHash) => {
      this.map.set(valueHash, probality / this.sum);
    });
    this.sum = 1;
  }

  private getRepresentative(value: T): T {
    if (typeof value === "number" || typeof value === "string") {
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
