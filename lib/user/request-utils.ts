import mongoose from "mongoose";

type CreateRequestBody = {
  employeeName?: string;
  employeeId?: string;
  itemName: string;
  quantity: number;
  remarks?: string;
};

type RequestQueryFilter = {
  employeeName?: string;
  employeeId?: string;
  status?: "Pending" | "Approved" | "Rejected";
};

export function isValidRequestId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export function normalizeRequestStatus(status: string | null) {
  if (!status) {
    return null;
  }

  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "pending") {
    return "Pending";
  }

  if (normalizedStatus === "approved") {
    return "Approved";
  }

  if (normalizedStatus === "rejected") {
    return "Rejected";
  }

  return null;
}

export async function parseCreateRequestBody(request: Request): Promise<CreateRequestBody> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new Error("INVALID_JSON_BODY");
  }

  if (!body || typeof body !== "object") {
    throw new Error("INVALID_REQUEST_BODY");
  }

  const parsedBody = body as Record<string, unknown>;
  const itemName = typeof parsedBody.itemName === "string" ? parsedBody.itemName.trim() : "";
  const quantity = parsedBody.quantity;
  const remarks = typeof parsedBody.remarks === "string" ? parsedBody.remarks.trim() : "";
  const employeeName =
    typeof parsedBody.employeeName === "string" ? parsedBody.employeeName.trim() : "";
  const employeeId =
    typeof parsedBody.employeeId === "string" ? parsedBody.employeeId.trim() : "";

  if (!itemName) {
    throw new Error("ITEM_NAME_REQUIRED");
  }

  if (typeof quantity !== "number" || Number.isNaN(quantity) || quantity <= 0) {
    throw new Error("INVALID_QUANTITY");
  }

  return {
    employeeName,
    employeeId,
    itemName,
    quantity,
    remarks,
  };
}

export function buildRequestQueryFilter(url: string): RequestQueryFilter {
  const { searchParams } = new URL(url);
  const employeeName = searchParams.get("employeeName")?.trim();
  const employeeId = searchParams.get("employeeId")?.trim();
  const status = normalizeRequestStatus(searchParams.get("status"));

  const filter: RequestQueryFilter = {};

  if (employeeName) {
    filter.employeeName = employeeName;
  }

  if (employeeId) {
    filter.employeeId = employeeId;
  }

  if (status) {
    filter.status = status;
  }

  return filter;
}