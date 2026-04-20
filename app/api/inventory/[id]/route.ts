import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import InventoryItem from "@/lib/models/InventoryItem";

// PATCH /api/inventory/[id] — update item quantity
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid inventory id", error: "Invalid inventory id" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body", error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { quantity } = body;

    if (quantity == null || typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be a number greater than or equal to 0",
          error: "Invalid quantity",
        },
        { status: 400 }
      );
    }

    const item = await InventoryItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found", error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inventory item updated successfully",
        data: item,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Failed to update inventory item", error: message },
      { status: 500 }
    );
  }
}
