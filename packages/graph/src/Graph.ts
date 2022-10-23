import { Dice } from "kostki";

export class Graph<T = number> {
  private datasets: {
    label: string;
    data: { x: T; y: number }[];
  }[] = [];
  private labelSorter: (a: T, b: T) => number;

  constructor(
    sorter: (a: T, b: T) => number = (a, b) => (a as any) - (b as any)
  ) {
    this.labelSorter = sorter;
  }

  addDataset(label: string, dice: Dice<T>) {
    const data = dice.pairs.map(([x, y]) => ({
      x,
      y,
    }));

    this.datasets.push({ label, data });
  }

  regularGraph() {
    return this.createGraphData((x) => x, "middle");
  }

  sumGraph() {
    return this.createGraphData((data) => {
      let sum = 0;
      return data
        .reverse()
        .map((point) => {
          sum += point.y;

          return {
            x: point.x,
            y: sum,
          };
        })
        .reverse();
    }, "after");
  }

  private createGraphData(
    dataMapper: (data: { x: T; y: number }[]) => { x: T; y: number }[],
    stepConfig: "middle" | "after"
  ) {
    return {
      labels: Array.from(
        new Set(this.datasets.flatMap((x) => x.data.map((v) => v.x)))
      ).sort(this.labelSorter),
      datasets: this.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataMapper(
          dataset.data.sort((a, b) => this.labelSorter(a.x, b.x))
        ),
        stepped: stepConfig,
        borderColor: `hsl(${(index / this.datasets.length) * 360}, 80%, 60%)`,
        backgroundColor: `hsla(${
          (index / this.datasets.length) * 360
        }, 80%, 60%, 0.5)`,
      })),
    };
  }
}
