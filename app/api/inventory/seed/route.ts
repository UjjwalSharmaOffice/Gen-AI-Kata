import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import InventoryItem from "@/lib/models/InventoryItem";

const SEED_DATA = [
  { name: "Whiteboard Marker", quantity: 50 },
  { name: "Notebook", quantity: 100 },
  { name: "Ballpoint Pen", quantity: 200 },
  { name: "Sticky Notes", quantity: 80 },
  { name: "Stapler", quantity: 15 },
  { name: "A4 Paper Ream", quantity: 40 },
];

// POST /api/inventory/seed — seed inventory with sample data
export async function POST(request: NextRequest) {
  try {
    const { response } = requireAuth(request, ["admin"]);

    if (response) {
      return response;
    }

    await connectToDatabase();

    const results = [];

    for (const item of SEED_DATA) {
      const existing = await InventoryItem.findOne({ name: item.name });
      if (!existing) {
        const created = await InventoryItem.create(item);
        results.push(created);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `${results.length} item(s) seeded`,
        data: results,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Failed to seed inventory", error: message },
      { status: 500 }
    );
  }
}
