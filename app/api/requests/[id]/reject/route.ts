import { NextRequest, NextResponse } from "next/server";
import { isValidRequestId, rejectRequestById } from "@/lib/admin/request-utils";
import { requireAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response } = requireAuth(request, ["admin"]);

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

    const body = await request.json().catch(() => ({}));
    const updatedRequest = await rejectRequestById(id, body.rejectionReason);

    return NextResponse.json(
      {
        success: true,
        message: "Request rejected successfully",
        data: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message === "REQUEST_NOT_FOUND") {
      return NextResponse.json(
        { success: false, message: "Request not found", error: "Request not found" },
        { status: 404 }
      );
    }

    if (message === "REQUEST_ALREADY_PROCESSED") {
      return NextResponse.json(
        {
          success: false,
          message: "Only pending requests can be rejected",
          error: "Request already processed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to reject request", error: message },
      { status: 500 }
    );
  }
}