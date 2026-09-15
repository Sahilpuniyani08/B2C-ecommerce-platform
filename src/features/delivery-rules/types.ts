export interface DeliveryRule {
  id: string;
  name: string;
  state?: string | null;
  city?: string | null;
  pincode?: string | null;
  minDays: number;
  maxDays: number;
  deliveryCharge: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryRuleInput {
  name: string;
  state?: string;
  city?: string;
  pincode?: string;
  minDays: number;
  maxDays: number;
  deliveryCharge: number;
  isActive?: boolean;
}

export interface UpdateDeliveryRuleInput {
  name?: string;
  state?: string | null;
  city?: string | null;
  pincode?: string | null;
  minDays?: number;
  maxDays?: number;
  deliveryCharge?: number;
  isActive?: boolean;
}
