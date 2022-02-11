import { writeFileSync } from "fs";
import { Dice } from "../src/Dice";
import { d10 } from "../src/diceFactories";
import { higherOfTwo, sum } from "../src/helpers";

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

  saveToFile(filePath: string) {
    writeFileSync(
      filePath,
      this.renderTemplate(
        JSON.stringify(
          this.createGraphData((x) => x, "middle"),
          undefined,
          2
        ),
        JSON.stringify(
          this.createGraphData((data) => {
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
          }, "after"),
          undefined,
          2
        )
      ),
      "utf-8"
    );
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

  private renderTemplate(dataJSON: string, dataSumJSON: string) {
    return `\
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js" integrity="sha512-TW5s0IT/IppJtu76UbysrBH9Hy/5X41OTAbQuffZFU6lQ1rdcLHzpU5BzVvr/YFykoiMYZVWlr/PX1mDcfM9Qg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <div style="width: 800px; height: 600px">
        <canvas id="plot"></canvas>
      </div>
      <div style="width: 800px; height: 600px">
        <canvas id="plot-sum"></canvas>
      </div>
      <script>
        const ctx = document.getElementById('plot').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: ${dataJSON},
        });

        const ctxSum = document.getElementById('plot-sum').getContext('2d');
        new Chart(ctxSum, {
            type: 'line',
            data: ${dataSumJSON},
        });
      </script>`;
  }
}
