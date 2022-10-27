import { Chart, ChartData, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

export function Line<T>({ data }: { data: ChartData<"line", T> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart<"line", T> | null>(null);

  useEffect(() => {
    const context = canvas.current!.getContext("2d")!;

    chart.current = new Chart<"line", T>(context, {
      type: "line",
      data: { datasets: [] },
    });

    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (chart.current) {
      const currentDatasets = chart.current.data.datasets;
      const newDatasets = data.datasets.map((newDataset) => {
        const oldDataset = currentDatasets.find(
          (d) => d.label && d.label === newDataset.label
        );

        if (oldDataset) {
          oldDataset.data = newDataset.data;
          return oldDataset;
        } else {
          return newDataset;
        }
      });

      chart.current.data.datasets = newDatasets;
      chart.current.data.labels = data.labels;
      chart.current.update();
    }
  }, [data]);

  return (
    <div style={{ width: "800px", height: "600px" }}>
      <canvas ref={canvas}></canvas>
    </div>
  );
}
