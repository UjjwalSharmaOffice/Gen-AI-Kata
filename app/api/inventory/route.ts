import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import InventoryItem from "@/lib/models/InventoryItem";

// GET /api/inventory — list all inventory items
export async function GET() {
  try {
    await connectToDatabase();
    const items = await InventoryItem.find({}).sort({ name: 1 });
    return NextResponse.json(
      {
        success: true,
        message: "Inventory fetched successfully",
        data: items,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Failed to fetch inventory", error: message },
      { status: 500 }
    );
  }
}

// POST /api/inventory — add a new inventory item (admin / seed)
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { name, quantity } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "name is required" },
        { status: 400 }
      );
    }

    if (quantity == null || typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json(
        { success: false, error: "quantity must be a number >= 0" },
        { status: 400 }
      );
    }

    const item = await InventoryItem.create({
      name: name.trim(),
      quantity,
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
