import { NextRequest, NextResponse } from "next/server";
import { approveRequestById, isValidRequestId } from "@/lib/admin/request-utils";
import { requireAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response } = requireAuth(_request, ["admin"]);

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

    const updatedRequest = await approveRequestById(id);

    return NextResponse.json(
      {
        success: true,
        message: "Request approved successfully",
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
          message: "Only pending requests can be approved",
          error: "Request already processed",
        },
        { status: 400 }
      );
    }

    if (message === "INVALID_REQUEST_QUANTITY") {
      return NextResponse.json(
        {
          success: false,
          message: "Request quantity must be greater than 0",
          error: "Invalid request quantity",
        },
        { status: 400 }
      );
    }

    if (message === "INVENTORY_ITEM_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message: "Inventory item not found",
          error: "Inventory item not found",
        },
        { status: 404 }
      );
    }

    if (message === "INSUFFICIENT_STOCK") {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient inventory to approve request",
          error: "Insufficient stock",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to approve request", error: message },
      { status: 500 }
    );
  }
}