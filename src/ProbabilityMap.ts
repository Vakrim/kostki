export class ProbabilityMap<T extends number | string> {
  private map: Map<T, number> = new Map();
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

  getProbabilityOf(value: T): number {
    return this.map.get(value) || 0;
  }

  *[Symbol.iterator]() {
    for (let pair of this.map) {
      yield pair;
    }
  }
}
