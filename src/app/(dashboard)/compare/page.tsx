"use client";
import { useState } from "react";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { CompareChart } from "@/components/compare/CompareChart";
import { CompareTable } from "@/components/compare/CompareTable";
import { useStockCandles } from "@/hooks/useStockCandles";
import { StockCandle } from "@/types/stock";

function useMultipleCandles(symbols: string[]): Record<string, StockCandle> {
  const s0 = useStockCandles(symbols[0] ?? "", "D");
  const s1 = useStockCandles(symbols[1] ?? "", "D");
  const s2 = useStockCandles(symbols[2] ?? "", "D");
  const s3 = useStockCandles(symbols[3] ?? "", "D");

  const result: Record<string, StockCandle> = {};
  const results = [s0, s1, s2, s3];

  symbols.forEach((symbol, i) => {
    if (results[i]?.data) {
      result[symbol] = results[i].data as StockCandle;
    }
  });

  return result;
}

export default function ComparePage() {
  const [symbols, setSymbols] = useState<string[]>(["AAPL", "TSLA"]);
  const candlesData = useMultipleCandles(symbols);

  const allLoaded = symbols.every(
    (s) => candlesData[s]?.t && candlesData[s].t.length > 0
  );

  function handleAdd(symbol: string) {
    if (symbols.length >= 4) return;
    setSymbols((prev) => [...prev, symbol]);
  }

  function handleRemove(symbol: string) {
    setSymbols((prev) => prev.filter((s) => s !== symbol));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Compare</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Compare multiple stocks side by side
        </p>
      </div>

      <CompareSelector
        symbols={symbols}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      {symbols.length >= 2 ? (
        allLoaded ? (
          <>
            <CompareChart symbols={symbols} data={candlesData} />
            <CompareTable symbols={symbols} />
          </>
        ) : (
          <div className="flex items-center justify-center py-20 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground text-sm">Loading chart data...</p>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center py-20 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground text-sm">
            Add at least 2 symbols to compare
          </p>
        </div>
      )}
    </div>
  );
}