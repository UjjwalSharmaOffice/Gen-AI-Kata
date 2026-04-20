import { NextRequest, NextResponse } from "next/server";
import { normalizeRequestStatus } from "@/lib/admin/request-utils";
import connectToDatabase from "@/lib/mongodb";
import Request from "@/lib/models/Request";

// GET /api/requests — list all requests, optionally filter by ?status=
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = normalizeRequestStatus(searchParams.get("status"));

    const filter: Record<string, string> = {};
    if (status) {
      filter.status = status;
    }

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

    const body = await req.json();
    const { itemName, quantity, remarks } = body;

    // Validation
    if (!itemName || typeof itemName !== "string" || itemName.trim() === "") {
      return NextResponse.json(
        { success: false, error: "itemName is required" },
        { status: 400 }
      );
    }

    if (quantity == null || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "quantity must be a number greater than 0" },
        { status: 400 }
      );
    }

    const newRequest = await Request.create({
      employeeName: typeof body.employeeName === "string" ? body.employeeName.trim() : "",
      itemName: itemName.trim(),
      quantity,
      remarks: remarks ?? "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Request created successfully",
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Failed to create request", error: message },
      { status: 500 }
    );
  }
}
