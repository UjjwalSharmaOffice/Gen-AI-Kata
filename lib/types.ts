export type RequestStatus = "Pending" | "Approved" | "Rejected";

export type AuthRole = "employee" | "admin";

export type AuthSession = {
  username: string;
  displayName: string;
  role: AuthRole;
};

export type SupplyRequest = {
  _id: string;
  employeeName?: string;
  employeeId?: string;
  itemName: string;
  quantity: number;
  remarks?: string;
  status: RequestStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type InventoryItem = {
  _id: string;
  name: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
};
