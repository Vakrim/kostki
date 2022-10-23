import {
  Chart,
  ChartData,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export function Line<T,>({ data }: { data: ChartData<"line", T> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart<'line', T> | null>(null);

  useEffect(() => {
    const context = canvas.current!.getContext("2d")!;

    chart.current = new Chart<'line', T>(context, {
      type: "line",
      data,
    });

    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (chart.current) {
      chart.current.data = data;
      chart.current.update();
    }
  }, [data]);

  return (
    <div style={{ width: "800px", height: "600px" }}>
      <canvas ref={canvas}></canvas>
    </div>
  );
}
