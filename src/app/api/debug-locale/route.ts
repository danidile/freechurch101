import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const headersList = await headers();
  const allHeaders = Object.fromEntries(headersList.entries());
  return NextResponse.json(allHeaders);
}
