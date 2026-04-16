import { NextResponse } from "next/server";
import { searchSymbol } from "@/lib/finnhub";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter required" },
        { status: 400 }
      );
    }

    const data = await searchSymbol(query);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search symbols" },
      { status: 500 }
    );
  }
}
