import { Dice } from "kostki";

export class Graph<T = number> {
  private datasets: {
    label: string;
    data: { x: T; y: number }[];
  }[] = [];
  private labelSorter: (a: T, b: T) => number;

  constructor(
    sorter: (a: T, b: T) => number = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a - b;
      }
      return 0;
    }
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

  private formatLabel(x: T) {
    if (typeof x === "string" || typeof x === "number") return `${x}`;
    return JSON.stringify(x);
  }

  private createGraphData(
    dataMapper: (
      data: { x: string; y: number }[]
    ) => { x: string; y: number }[],
    stepConfig: "middle" | "after"
  ) {
    const labels = Array.from(
      new Set(this.datasets.flatMap((x) => x.data.map((v) => v.x)))
    )
      .sort(this.labelSorter)
      .map(this.formatLabel);

    return {
      labels,
      datasets: this.datasets.map((dataset, index) => {
        return {
          label: dataset.label,
          data: dataMapper(
            dataset.data
              .sort((a, b) => this.labelSorter(a.x, b.x))
              .map((point) => ({
                x: this.formatLabel(point.x),
                y: point.y,
              }))
          ),
          stepped: stepConfig,
          borderColor: `hsl(${(index / this.datasets.length) * 360}, 80%, 60%)`,
          backgroundColor: `hsla(${
            (index / this.datasets.length) * 360
          }, 80%, 60%, 0.5)`,
        };
      }),
    };
  }
}
