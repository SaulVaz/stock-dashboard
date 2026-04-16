import { NextResponse } from "next/server";
import { getCompanyProfile } from "@/lib/finnhub";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const data = await getCompanyProfile(symbol.toUpperCase());
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}