const prisma = require('./prisma');

async function transitionAssetStatus(assetId, newStatus, reason, actorId) {
  // Update Asset.status in Prisma
  const updatedAsset = await prisma.asset.update({
    where: { id: assetId },
    data: { status: newStatus },
  });

  // Write an entry to ActivityLog
  await prisma.activityLog.create({
    data: {
      actorId: actorId || 'SYSTEM',
      actionType: newStatus,
      entityType: 'Asset',
      entityId: assetId,
      description: reason,
    },
  });

  return updatedAsset;
}

module.exports = {
  transitionAssetStatus,
};
