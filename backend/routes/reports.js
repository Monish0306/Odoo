const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');

// GET /asset-utilization - Get asset counts grouped by category and status
router.get('/asset-utilization', auth, async (req, res) => {
  try {
    // 1. Group assets by category and status using prisma.groupBy
    const grouped = await prisma.asset.groupBy({
      by: ['categoryId', 'status'],
      _count: {
        id: true
      }
    });

    // 2. Fetch categories to map names
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });

    // 3. Format result
    const result = grouped.map(item => ({
      categoryId: item.categoryId,
      categoryName: categoryMap[item.categoryId] || 'Unknown',
      status: item.status,
      count: item._count.id
    }));

    return res.json({ data: result, error: null });
  } catch (err) {
    console.error('Get asset utilization report error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// GET /maintenance-summary - Get request counts by status & average resolution time
router.get('/maintenance-summary', auth, async (req, res) => {
  try {
    // 1. Group counts by status
    const grouped = await prisma.maintenanceRequest.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    const statusCounts = {};
    grouped.forEach(item => {
      statusCounts[item.status] = item._count.id;
    });

    // 2. Fetch only required fields for resolved requests to calculate average time in JS
    const resolvedRequests = await prisma.maintenanceRequest.findMany({
      where: {
        status: 'Resolved',
        resolvedAt: { not: null }
      },
      select: {
        createdAt: true,
        resolvedAt: true
      }
    });

    let avgResolutionTimeMs = 0;
    if (resolvedRequests.length > 0) {
      const totalDiffMs = resolvedRequests.reduce((sum, req) => {
        const diff = new Date(req.resolvedAt) - new Date(req.createdAt);
        return sum + diff;
      }, 0);
      avgResolutionTimeMs = totalDiffMs / resolvedRequests.length;
    }

    // Convert to hours for better readability
    const avgResolutionTimeHours = Number((avgResolutionTimeMs / (1000 * 60 * 60)).toFixed(2));

    return res.json({
      data: {
        statusCounts,
        avgResolutionTimeHours,
        avgResolutionTimeMs
      },
      error: null
    });
  } catch (err) {
    console.error('Get maintenance summary report error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
