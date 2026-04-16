"use client";
import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  AreaSeries,
  LineSeries,
  HistogramSeries,
} from "lightweight-charts";
import { StockCandle } from "@/types/stock";

interface PriceChartProps {
  data: StockCandle;
  type?: "candlestick" | "area";
  showMA?: boolean;
  showVolume?: boolean;
  maPeriod?: number;
}

function calculateMA(prices: number[], period: number): (number | null)[] {
  return prices.map((_, i) => {
    if (i < period - 1) return null;
    const slice = prices.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

export function PriceChart({
  data,
  type = "area",
  showMA = false,
  showVolume = false,
  maPeriod = 20,
}: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const volumeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data?.t) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: document.documentElement.classList.contains("dark") ? "#888" : "#555",
      },
      grid: {
        vertLines: { color: document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
        horzLines: { color: document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
      },
      crosshair: {
        vertLine: { color: document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" },
        horzLine: { color: document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" },
      },
      rightPriceScale: {
        borderColor: document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      },
      timeScale: {
        borderColor: document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        timeVisible: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    if (type === "candlestick") {
      const candleData = data.t.map((time, i) => ({
        time: time as number,
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
      }));

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });
      candleSeries.setData(candleData);
    } else {
      const areaData = data.t.map((time, i) => ({
        time: time as number,
        value: data.c[i],
      }));

      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: "#6366f1",
        topColor: "rgba(99,102,241,0.3)",
        bottomColor: "rgba(99,102,241,0.0)",
        lineWidth: 2,
      });
      areaSeries.setData(areaData);
    }

    // Media móvil
    if (showMA && data.c.length >= maPeriod) {
      const maValues = calculateMA(data.c, maPeriod);
      const maData = data.t
        .map((time, i) => ({
          time: time as number,
          value: maValues[i],
        }))
        .filter((d) => d.value !== null) as { time: number; value: number }[];

      const maSeries = chart.addSeries(LineSeries, {
        color: "#f59e0b",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: true,
        title: `MA${maPeriod}`,
      });
      maSeries.setData(maData);
    }

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
  }, [data, type, showMA, showVolume, maPeriod]);

  // Volumen chart separado
  useEffect(() => {
    if (!volumeContainerRef.current || !data?.t || !showVolume) return;

    const volumeChart = createChart(volumeContainerRef.current, {
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
      handleScroll: false,
      handleScale: false,
      width: volumeContainerRef.current.clientWidth,
      height: 100,
    });

    const volumeData = data.t.map((time, i) => ({
      time: time as number,
      value: data.v[i],
      color: data.c[i] >= data.o[i]
        ? "rgba(34,197,94,0.5)"
        : "rgba(239,68,68,0.5)",
    }));

    const volumeSeries = volumeChart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    volumeChart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.1, bottom: 0 },
    });

    volumeSeries.setData(volumeData);
    volumeChart.timeScale().fitContent();

    const handleResize = () => {
      if (volumeContainerRef.current) {
        volumeChart.applyOptions({
          width: volumeContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      volumeChart.remove();
    };
  }, [data, showVolume]);

  return (
    <div className="flex flex-col gap-2">
      <div ref={chartContainerRef} className="w-full h-[400px]" />
      {showVolume && (
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground px-1 mb-1">Volume</p>
          <div ref={volumeContainerRef} className="w-full h-[100px]" />
        </div>
      )}
    </div>
  );
}