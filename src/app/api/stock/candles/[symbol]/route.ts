import { NextResponse } from "next/server";
import { getStockCandlesAlt } from "@/lib/finnhub";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);
    const resolution = searchParams.get("resolution") ?? "D";

    const data = await getStockCandlesAlt(symbol.toUpperCase(), resolution);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch candles" },
      { status: 500 }
    );
  }
}