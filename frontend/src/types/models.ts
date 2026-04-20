export type Role = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export interface RequestItem {
  id: string;
  quantity: number;
  item: InventoryItem;
}

export interface SupplyRequest {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  items: RequestItem[];
  employee?: User;
  reviewedBy?: User;
}
