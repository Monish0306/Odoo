const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { isNonEmptyString, isValidEnum } = require('../utils/validation');

const allowedRoles = ['Employee', 'DeptHead', 'AssetManager', 'Admin'];

router.get('/departments', auth, async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        headId: true,
        parentDeptId: true,
        status: true,
      },
    });

    return res.json({ data: departments, error: null });
  } catch (err) {
    console.error('Get departments error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.post('/departments', auth, requireRole('Admin'), async (req, res) => {
  try {
    const body = req.body || {};
    const { name, headId, parentDeptId } = body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({ data: null, error: 'Department name is required' });
    }

    if (headId !== undefined && headId !== null && !isNonEmptyString(headId)) {
      return res.status(400).json({ data: null, error: 'headId must be a non-empty string when provided' });
    }

    if (parentDeptId !== undefined && parentDeptId !== null && !isNonEmptyString(parentDeptId)) {
      return res.status(400).json({ data: null, error: 'parentDeptId must be a non-empty string when provided' });
    }

    const department = await prisma.department.create({
      data: {
        name,
        headId: headId || undefined,
        parentDeptId: parentDeptId || undefined,
      },
    });

    return res.status(201).json({ data: department, error: null });
  } catch (err) {
    console.error('Create department error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.patch('/departments/:id', auth, requireRole('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, headId, parentDeptId, status } = req.body;

    const department = await prisma.department.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(headId !== undefined ? { headId: headId || null } : {}),
        ...(parentDeptId !== undefined ? { parentDeptId: parentDeptId || null } : {}),
        ...(status ? { status } : {}),
      },
    });

    return res.json({ data: department, error: null });
  } catch (err) {
    console.error('Update department error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return res.json({ data: categories, error: null });
  } catch (err) {
    console.error('Get categories error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.post('/categories', auth, requireRole('Admin'), async (req, res) => {
  try {
    const { name, customFields } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({ data: null, error: 'Category name is required' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        customFields: customFields ?? undefined,
      },
    });

    return res.status(201).json({ data: category, error: null });
  } catch (err) {
    console.error('Create category error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.patch('/categories/:id', auth, requireRole('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const { name, customFields } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(customFields !== undefined ? { customFields } : {}),
      },
    });

    return res.json({ data: category, error: null });
  } catch (err) {
    console.error('Update category error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.get('/employees', auth, async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        departmentId: true,
      },
      orderBy: { name: 'asc' },
    });

    return res.json({ data: employees, error: null });
  } catch (err) {
    console.error('Get employees error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.patch('/employees/:id/promote', auth, requireRole('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const { role } = body;

    if (!isValidEnum(role, allowedRoles)) {
      return res.status(400).json({ data: null, error: 'Role must be one of Employee, DeptHead, AssetManager, or Admin' });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        departmentId: true,
      },
    });

    return res.json({ data: employee, error: null });
  } catch (err) {
    console.error('Promote employee error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
