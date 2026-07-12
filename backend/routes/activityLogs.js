const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// GET / - Get activity logs (Admin/AssetManager only)
router.get('/', auth, requireRole('Admin', 'AssetManager'), async (req, res) => {
  try {
    const { entityType, entityId, actorId } = req.query;
    const where = {};

    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (actorId) where.actorId = actorId;

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      include: {
        actor: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return res.json({ data: logs, error: null });
  } catch (err) {
    console.error('Get activity logs error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
