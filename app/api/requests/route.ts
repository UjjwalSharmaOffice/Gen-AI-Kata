import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Request from "@/lib/models/Request";
import { buildRequestQueryFilter, parseCreateRequestBody } from "@/lib/user/request-utils";

// GET /api/requests — list requests, optionally filtered by employee or status
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const filter = buildRequestQueryFilter(req.url);

    const requests = await Request.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        message: "Requests fetched successfully",
        data: requests,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Failed to fetch requests", error: message },
      { status: 500 }
    );
  }
}

// POST /api/requests — create a new supply request
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await parseCreateRequestBody(req);

    const newRequest = await Request.create({
      employeeName: body.employeeName,
      employeeId: body.employeeId,
      itemName: body.itemName,
      quantity: body.quantity,
      remarks: body.remarks,
      status: "Pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Request submitted successfully",
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message === "INVALID_JSON_BODY") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body", error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (message === "INVALID_REQUEST_BODY") {
      return NextResponse.json(
        { success: false, message: "Request body must be a valid JSON object", error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (message === "ITEM_NAME_REQUIRED") {
      return NextResponse.json(
        { success: false, message: "Item name is required", error: "Item name is required" },
        { status: 400 }
      );
    }

    if (message === "INVALID_QUANTITY") {
      return NextResponse.json(
        { success: false, message: "Quantity must be greater than 0", error: "Invalid quantity" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to submit request", error: message },
      { status: 500 }
    );
  }
}
