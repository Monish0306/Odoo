const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { isNonEmptyString } = require('../utils/validation');

router.post('/transfers', auth, async (req, res) => {
  try {
    const body = req.body || {};
    const { assetId, toEmployeeId, reason } = body;

    if (!isNonEmptyString(assetId)) {
      return res.status(400).json({ data: null, error: 'assetId is required' });
    }

    if (!isNonEmptyString(toEmployeeId)) {
      return res.status(400).json({ data: null, error: 'toEmployeeId is required' });
    }

    const activeAllocation = await prisma.allocation.findFirst({
      where: { assetId, status: 'Active' },
    });

    if (!activeAllocation) {
      return res.status(404).json({ data: null, error: 'No active allocation found for this asset' });
    }

    const transfer = await prisma.transferRequest.create({
      data: {
        assetId,
        fromEmployeeId: activeAllocation.employeeId,
        toEmployeeId,
        reason,
        status: 'Requested',
        requestedBy: req.user.userId,
      },
    });

    return res.status(201).json({ data: transfer, error: null });
  } catch (err) {
    console.error('Create transfer error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.patch('/transfers/:id/approve', auth, requireRole('DeptHead', 'AssetManager', 'Admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const transfer = await prisma.transferRequest.findUnique({ where: { id } });
    if (!transfer) {
      return res.status(404).json({ data: null, error: 'Transfer request not found' });
    }

    const updatedTransfer = await prisma.transferRequest.update({
      where: { id },
      data: {
        status: 'Approved',
        approvedBy: req.user.userId,
      },
    });

    const activeAllocation = await prisma.allocation.findFirst({
      where: { assetId: transfer.assetId, status: 'Active' },
    });

    if (activeAllocation) {
      await prisma.allocation.update({
        where: { id: activeAllocation.id },
        data: {
          status: 'Returned',
          returnedDate: new Date(),
        },
      });
    }

    await prisma.allocation.create({
      data: {
        assetId: transfer.assetId,
        employeeId: transfer.toEmployeeId,
        status: 'Active',
      },
    });

    return res.json({ data: updatedTransfer, error: null });
  } catch (err) {
    console.error('Approve transfer error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.patch('/transfers/:id/reject', auth, requireRole('DeptHead', 'AssetManager', 'Admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const transfer = await prisma.transferRequest.update({
      where: { id },
      data: { status: 'Rejected' },
    });

    return res.json({ data: transfer, error: null });
  } catch (err) {
    console.error('Reject transfer error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
