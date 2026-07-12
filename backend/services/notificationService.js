const prisma = require('./prisma');

async function createNotification(employeeId, message, type) {
  return await prisma.notification.create({
    data: {
      employeeId,
      message,
      type
    }
  });
}

async function logActivity(actorId, actionType, entityType, entityId, description) {
  return await prisma.activityLog.create({
    data: {
      actorId,
      actionType,
      entityType,
      entityId,
      description
    }
  });
}

module.exports = {
  createNotification,
  logActivity
};
