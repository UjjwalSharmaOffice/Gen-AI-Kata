import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie, validateCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body", error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required", error: "Missing credentials" },
        { status: 400 }
      );
    }

    const session = validateCredentials(username, password);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password", error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: session,
      },
      { status: 200 }
    );

    setAuthCookie(response, session);

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Failed to log in", error: message },
      { status: 500 }
    );
  }
}