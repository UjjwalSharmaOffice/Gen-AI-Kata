import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);

  return NextResponse.json(
    {
      success: true,
      message: session ? "Session fetched successfully" : "No active session",
      data: session,
    },
    { status: 200 }
  );
}