import { NextRequest, NextResponse } from "next/server";
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
    const body = await req.json();
    const { quantity } = body;

    if (quantity == null || typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json(
        { success: false, error: "quantity must be a number >= 0" },
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
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
