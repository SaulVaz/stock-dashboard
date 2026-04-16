"use client";
import { useEffect, useRef } from "react";
import { createChart, ColorType, LineSeries,  type Time} from "lightweight-charts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

interface CompareChartProps {
  symbols: string[];
  data: Record<string, { t: number[]; c: number[] }>;
}

export function CompareChart({ symbols, data }: CompareChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || symbols.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#888",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.1)",
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.1)",
        timeVisible: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    symbols.forEach((symbol, i) => {
      const symbolData = data[symbol];
      if (!symbolData?.t) return;

      const lineData = symbolData.t.map((time, j) => ({
        time: time as Time,
        value: symbolData.c[j],
      }));

      const series = chart.addSeries(LineSeries, {
        color: COLORS[i % COLORS.length],
        lineWidth: 2,
        priceLineVisible: false,
      });

      series.setData(lineData);
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [symbols, data]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-foreground">
        Price comparison — 1 year
      </h2>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
}