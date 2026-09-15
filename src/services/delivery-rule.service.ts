import {
  findAllDeliveryRules,
  findDeliveryRuleById,
  findDeliveryRuleByPincode,
  createDeliveryRule,
  updateDeliveryRule,
  deleteDeliveryRule,
} from "@/repositories/delivery-rule.repository";
import { BusinessError } from "@/types/global";

export async function getDeliveryRules(activeOnly = false) {
  return findAllDeliveryRules(activeOnly);
}

export async function getDeliveryRuleById(id: string) {
  const rule = await findDeliveryRuleById(id);
  if (!rule) {
    throw new BusinessError("DELIVERY_RULE_NOT_FOUND", "Delivery rule not found");
  }
  return rule;
}

export async function checkDeliveryAvailability(pincode: string) {
  const rule = await findDeliveryRuleByPincode(pincode);
  if (!rule) {
    throw new BusinessError(
      "DELIVERY_NOT_AVAILABLE",
      "Delivery not available for this pincode"
    );
  }
  return rule;
}

export async function addDeliveryRule(data: {
  name: string;
  state?: string;
  city?: string;
  pincode?: string;
  minDays: number;
  maxDays: number;
  deliveryCharge: number;
  isActive?: boolean;
}) {
  if (data.maxDays < data.minDays) {
    throw new BusinessError(
      "INVALID_DELIVERY_DAYS",
      "maxDays must be greater than or equal to minDays"
    );
  }

  return createDeliveryRule(data);
}

export async function editDeliveryRule(
  id: string,
  data: {
    name?: string;
    state?: string | null;
    city?: string | null;
    pincode?: string | null;
    minDays?: number;
    maxDays?: number;
    deliveryCharge?: number;
    isActive?: boolean;
  }
) {
  const rule = await findDeliveryRuleById(id);
  if (!rule) {
    throw new BusinessError("DELIVERY_RULE_NOT_FOUND", "Delivery rule not found");
  }

  // Validate days if either is being updated
  const minDays = data.minDays ?? rule.minDays;
  const maxDays = data.maxDays ?? rule.maxDays;
  if (maxDays < minDays) {
    throw new BusinessError(
      "INVALID_DELIVERY_DAYS",
      "maxDays must be greater than or equal to minDays"
    );
  }

  return updateDeliveryRule(id, data);
}

export async function removeDeliveryRule(id: string) {
  const rule = await findDeliveryRuleById(id);
  if (!rule) {
    throw new BusinessError("DELIVERY_RULE_NOT_FOUND", "Delivery rule not found");
  }

  return deleteDeliveryRule(id);
}
