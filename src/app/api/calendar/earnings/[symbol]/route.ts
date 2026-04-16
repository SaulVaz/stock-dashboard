import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const API_KEY = process.env.FINNHUB_API_KEY;

    const res = await fetch(
      `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol.toUpperCase()}&token=${API_KEY}`
    );

    if (!res.ok) throw new Error("Failed to fetch earnings");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}
