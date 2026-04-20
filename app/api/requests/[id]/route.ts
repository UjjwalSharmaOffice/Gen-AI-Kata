import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Request from "@/lib/models/Request";
import { isValidRequestId } from "@/lib/user/request-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, response } = requireAuth(_request, ["employee", "admin"]);

    if (response) {
      return response;
    }

    await connectToDatabase();

    const { id } = await params;

    if (!isValidRequestId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid request id", error: "Invalid request id" },
        { status: 400 }
      );
    }

    const request = await Request.findById(id);

    if (!request) {
      return NextResponse.json(
        { success: false, message: "Request not found", error: "Request not found" },
        { status: 404 }
      );
    }

    if (session.role === "employee" && request.employeeName !== session.displayName) {
      return NextResponse.json(
        { success: false, message: "Request not found", error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Request fetched successfully",
        data: request,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, message: "Failed to fetch request", error: message },
      { status: 500 }
    );
  }
}