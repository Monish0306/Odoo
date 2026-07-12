const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { isNonEmptyString, isValidDateString, isValidNumber, isValidEnum } = require('../utils/validation');

const allowedConditions = ['Excellent', 'Good', 'Fair', 'Poor'];
const allowedStatuses = ['Available', 'Allocated', 'Under Maintenance', 'Disposed'];

function buildTag() {
  return `AF-${String(nextNumber).padStart(4, '0')}`;
}

async function getNextTag() {
  const assets = await prisma.asset.findMany({ select: { tag: true } });
  let maxNumber = 0;

  for (const asset of assets) {
    const match = asset.tag?.match(/^AF-(\d{4})$/);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (parsed > maxNumber) {
        maxNumber = parsed;
      }
    }
  }

  return `AF-${String(maxNumber + 1).padStart(4, '0')}`;
}

router.post('/assets', auth, requireRole('AssetManager', 'Admin'), async (req, res) => {
  try {
    const body = req.body || {};
    const {
      name,
      categoryId,
      serialNumber,
      acquisitionDate,
      acquisitionCost,
      condition,
      location,
      photoUrl,
      isBookable,
      departmentId,
    } = body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({ data: null, error: 'Name is required' });
    }

    if (!isNonEmptyString(categoryId)) {
      return res.status(400).json({ data: null, error: 'categoryId is required' });
    }

    if (acquisitionDate !== undefined && acquisitionDate !== null && !isValidDateString(acquisitionDate)) {
      return res.status(400).json({ data: null, error: 'acquisitionDate must be a valid date string' });
    }

    if (acquisitionCost !== undefined && acquisitionCost !== null && !isValidNumber(Number(acquisitionCost))) {
      return res.status(400).json({ data: null, error: 'acquisitionCost must be a valid number' });
    }

    if (condition !== undefined && condition !== null && !isValidEnum(condition, allowedConditions)) {
      return res.status(400).json({ data: null, error: 'condition must be one of Excellent, Good, Fair, or Poor' });
    }

    const tag = await getNextTag();
    const asset = await prisma.asset.create({
      data: {
        name,
        tag,
        categoryId,
        serialNumber,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        acquisitionCost: acquisitionCost ? Number(acquisitionCost) : null,
        condition,
        location,
        photoUrl,
        isBookable: Boolean(isBookable),
        departmentId,
        status: 'Available',
      },
    });

    return res.status(201).json({ data: asset, error: null });
  } catch (err) {
    console.error('Create asset error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.get('/assets', auth, async (req, res) => {
  try {
    const { category, status, department, search } = req.query;
    const where = {};

    if (category) where.categoryId = category;
    if (status) where.status = status;
    if (department) where.departmentId = department;
    if (search) {
      where.OR = [
        { tag: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const assets = await prisma.asset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        department: true,
      },
    });

    return res.json({ data: assets, error: null });
  } catch (err) {
    console.error('Get assets error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.get('/assets/:id', auth, async (req, res) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        department: true,
      },
    });

    if (!asset) {
      return res.status(404).json({ data: null, error: 'Asset not found' });
    }

    return res.json({ data: asset, error: null });
  } catch (err) {
    console.error('Get asset error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.get('/assets/:id/history', auth, async (req, res) => {
  try {
    const allocationHistory = await prisma.allocation.findMany({
      where: { assetId: req.params.id },
      orderBy: { allocatedDate: 'desc' },
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

    return res.json({ data: { allocationHistory, maintenanceHistory: [] }, error: null });
  } catch (err) {
    console.error('Get asset history error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
