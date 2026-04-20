import mongoose from "mongoose";
import InventoryItem from "@/lib/models/InventoryItem";
import Request, { IRequest } from "@/lib/models/Request";

export type RequestStatus = "Pending" | "Approved" | "Rejected";

export function isValidRequestId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export function normalizeRequestStatus(status: string | null): RequestStatus | null {
  if (!status) {
    return null;
  }

  const normalized = status.trim().toLowerCase();

  if (normalized === "pending") {
    return "Pending";
  }

  if (normalized === "approved") {
    return "Approved";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  return null;
}

export async function approveRequestById(id: string): Promise<IRequest> {
  const supplyRequest = await Request.findById(id);

  if (!supplyRequest) {
    throw new Error("REQUEST_NOT_FOUND");
  }

  if (supplyRequest.status !== "Pending") {
    throw new Error("REQUEST_ALREADY_PROCESSED");
  }

  if (supplyRequest.quantity <= 0) {
    throw new Error("INVALID_REQUEST_QUANTITY");
  }

  const inventoryItem = await InventoryItem.findOne({
    name: supplyRequest.itemName,
  });

  if (!inventoryItem) {
    throw new Error("INVENTORY_ITEM_NOT_FOUND");
  }

  const updatedInventoryItem = await InventoryItem.findOneAndUpdate(
    {
      _id: inventoryItem._id,
      quantity: { $gte: supplyRequest.quantity },
    },
    {
      $inc: { quantity: -supplyRequest.quantity },
    },
    {
      new: true,
    }
  );

  if (!updatedInventoryItem) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  const updatedRequest = await Request.findOneAndUpdate(
    {
      _id: id,
      status: "Pending",
    },
    {
      $set: {
        status: "Approved",
      },
    },
    {
      new: true,
    }
  );

  if (!updatedRequest) {
    await InventoryItem.findByIdAndUpdate(inventoryItem._id, {
      $inc: { quantity: supplyRequest.quantity },
    });

    throw new Error("REQUEST_ALREADY_PROCESSED");
  }

  return updatedRequest;
}

export async function rejectRequestById(
  id: string,
  rejectionReason?: string
): Promise<IRequest> {
  const supplyRequest = await Request.findById(id);

  if (!supplyRequest) {
    throw new Error("REQUEST_NOT_FOUND");
  }

  if (supplyRequest.status !== "Pending") {
    throw new Error("REQUEST_ALREADY_PROCESSED");
  }

  supplyRequest.status = "Rejected";
  supplyRequest.rejectionReason = rejectionReason?.trim() ?? "";

  await supplyRequest.save();
  return supplyRequest;
}