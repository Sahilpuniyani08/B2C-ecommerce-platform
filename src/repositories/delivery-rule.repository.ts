import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function findAllDeliveryRules(activeOnly = false) {
  return prisma.deliveryRule.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function findDeliveryRuleById(id: string) {
  return prisma.deliveryRule.findUnique({
    where: { id },
  });
}

/**
 * Find an active delivery rule matching the given pincode.
 * Falls back to city/state matching if no exact pincode rule exists.
 */
export async function findDeliveryRuleByPincode(pincode: string) {
  // First, try exact pincode match
  const pincodeRule = await prisma.deliveryRule.findFirst({
    where: {
      pincode,
      isActive: true,
    },
  });

  if (pincodeRule) return pincodeRule;

  // Check if there are specific active pincode rules defined in the system
  const hasSpecificPincodeRules = await prisma.deliveryRule.count({
    where: {
      pincode: { not: null },
      isActive: true,
    },
  });

  // If specific pincode rules exist, unlisted pincodes are NOT available
  if (hasSpecificPincodeRules > 0) {
    return null;
  }

  // Fallback: try a general rule (no pincode specified) if no specific pincodes exist
  const generalRule = await prisma.deliveryRule.findFirst({
    where: {
      pincode: null,
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return generalRule;
}

export async function createDeliveryRule(
  data: Prisma.DeliveryRuleCreateInput
) {
  return prisma.deliveryRule.create({ data });
}

export async function updateDeliveryRule(
  id: string,
  data: Prisma.DeliveryRuleUpdateInput
) {
  return prisma.deliveryRule.update({
    where: { id },
    data,
  });
}

export async function deleteDeliveryRule(id: string) {
  return prisma.deliveryRule.delete({
    where: { id },
  });
}
