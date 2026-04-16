"use client";
import { useEffect, useRef } from "react";
import { createChart, ColorType, AreaSeries } from "lightweight-charts";
import { useStockCandles } from "@/hooks/useStockCandles";

interface SparklineProps {
  symbol: string;
  positive: boolean;
}

function SparklineChart({
  data,
  positive,
}: {
  data: { t: number[]; c: number[] };
  positive: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data?.t) return;

    const color = positive ? "#22c55e" : "#ef4444";

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "transparent",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: { horzLine: { visible: false }, vertLine: { visible: false } },
      handleScroll: false,
      handleScale: false,
      width: containerRef.current.clientWidth,
      height: 50,
    });

    const areaData = data.t.map((time, i) => ({
      time: time as number,
      value: data.c[i],
    }));

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: positive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
      bottomColor: "rgba(0,0,0,0)",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    areaSeries.setData(areaData);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, positive]);

  return <div ref={containerRef} className="w-full h-[50px]" />;
}

export function Sparkline({ symbol, positive }: SparklineProps) {
  const { data, isLoading } = useStockCandles(symbol, "D");

  if (isLoading) {
    return (
      <div className="w-full h-[50px] flex items-center justify-center">
        <div className="w-full h-[2px] bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!data?.t) return null;

  const last7Days = {
    t: data.t.slice(-7),
    c: data.c.slice(-7),
  };

  return <SparklineChart data={last7Days} positive={positive} />;
}