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

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body", error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { name, quantity } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Item name is required", error: "Item name is required" },
        { status: 400 }
      );
    }

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

    const item = await InventoryItem.create({
      name: name.trim(),
      quantity,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inventory item created successfully",
        data: item,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Failed to create inventory item", error: message },
      { status: 500 }
    );
  }
}
