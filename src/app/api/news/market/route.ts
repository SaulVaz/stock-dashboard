import { NextResponse } from "next/server";
import { getMarketNews } from "@/lib/finnhub";

export async function GET() {
  try {
    const data = await getMarketNews();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch market news" },
      { status: 500 }
    );
  }
}
