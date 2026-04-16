import { NextResponse } from "next/server";
import { getCompanyNews } from "@/lib/finnhub";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);

    const from = searchParams.get("from") ??
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
    const to = searchParams.get("to") ??
      new Date()
        .toISOString()
        .split("T")[0];

    const data = await getCompanyNews(symbol.toUpperCase(), from, to);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch company news" },
      { status: 500 }
    );
  }
}