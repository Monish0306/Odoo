const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');

// GET /kpis - Return aggregated dashboard counts
router.get('/kpis', auth, async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Run count queries in parallel (independent queries)
    const [
      totalAssets,
      availableAssets,
      allocatedAssets,
      underMaintenanceAssets,
      openMaintenanceRequests,
      pendingBookingsToday,
      openAuditCycles,
      overdueAllocations
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'Available' } }),
      prisma.asset.count({ where: { status: 'Allocated' } }),
      prisma.asset.count({ where: { status: { in: ['UnderMaintenance', 'Under Maintenance'] } } }),
      prisma.maintenanceRequest.count({
        where: { status: { in: ['Pending', 'Assigned', 'InProgress'] } }
      }),
      prisma.booking.count({
        where: {
          status: 'Confirmed',
          startTime: { lt: todayEnd },
          endTime: { gt: todayStart }
        }
      }),
      prisma.auditCycle.count({ where: { status: 'Open' } }),
      prisma.allocation.count({
        where: {
          status: 'Active',
          expectedReturnDate: { lt: now, not: null }
        }
      })
    ]);

    return res.json({
      data: {
        totalAssets,
        availableAssets,
        allocatedAssets,
        underMaintenanceAssets,
        openMaintenanceRequests,
        pendingBookingsToday,
        openAuditCycles,
        overdueAllocations
      },
      error: null
    });
  } catch (err) {
    console.error('Get dashboard KPIs error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
