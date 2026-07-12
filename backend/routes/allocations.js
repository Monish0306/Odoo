const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');
const { isNonEmptyString, isValidDateString } = require('../utils/validation');
const { transitionAssetStatus } = require('../services/assetStatusService');

router.post('/allocations', auth, async (req, res) => {
  try {
    const body = req.body || {};
    const { assetId, employeeId, expectedReturnDate } = body;

    if (!isNonEmptyString(assetId)) {
      return res.status(400).json({ data: null, error: 'assetId is required' });
    }

    if (!isNonEmptyString(employeeId)) {
      return res.status(400).json({ data: null, error: 'employeeId is required' });
    }

    if (expectedReturnDate !== undefined && expectedReturnDate !== null && !isValidDateString(expectedReturnDate)) {
      return res.status(400).json({ data: null, error: 'expectedReturnDate must be a valid date string' });
    }

    const asset = await prisma.asset.findUnique({ where: { id: assetId }, select: { id: true, status: true } });
    if (!asset) {
      return res.status(404).json({ data: null, error: 'Asset not found' });
    }

    if (asset.status === 'Allocated') {
      const currentAllocation = await prisma.allocation.findFirst({
        where: { assetId, status: 'Active' },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              departmentId: true,
            },
          },
        },
      });

      return res.json({
        data: {
          blocked: true,
          currentHolder: currentAllocation?.employee || null,
          suggestTransfer: true,
        },
        error: null,
      });
    }

    const allocation = await prisma.allocation.create({
      data: {
        assetId,
        employeeId,
        expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : null,
        status: 'Active',
      },
    });

    await transitionAssetStatus(assetId, 'Allocated', 'New allocation', req.user.userId);

    return res.status(201).json({ data: allocation, error: null });
  } catch (err) {
    console.error('Create allocation error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.post('/allocations/:id/return', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const { conditionOnReturn } = body;

    const allocation = await prisma.allocation.findUnique({ where: { id } });
    if (!allocation) {
      return res.status(404).json({ data: null, error: 'Allocation not found' });
    }

    const updatedAllocation = await prisma.allocation.update({
      where: { id },
      data: {
        status: 'Returned',
        returnedDate: new Date(),
        conditionOnReturn,
      },
    });

    await transitionAssetStatus(allocation.assetId, 'Available', 'Returned', req.user.userId);

    return res.json({ data: updatedAllocation, error: null });
  } catch (err) {
    console.error('Return allocation error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.get('/allocations/overdue', auth, async (req, res) => {
  try {
    const overdue = await prisma.allocation.findMany({
      where: {
        status: 'Active',
        expectedReturnDate: {
          lt: new Date(),
          not: null,
        },
      },
      orderBy: { expectedReturnDate: 'asc' },
      include: {
        asset: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            departmentId: true,
          },
        },
      },
    });

    return res.json({ data: overdue, error: null });
  } catch (err) {
    console.error('Get overdue allocations error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
