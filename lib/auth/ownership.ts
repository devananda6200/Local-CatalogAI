export function canManageBusiness(ownerId: string, businessOwnerId: string) {
  return Boolean(ownerId) && ownerId === businessOwnerId;
}

export function assertBusinessOwnership(
  ownerId: string,
  businessOwnerId: string,
) {
  if (!canManageBusiness(ownerId, businessOwnerId)) {
    throw new Error("You do not have permission to manage this business.");
  }
}
