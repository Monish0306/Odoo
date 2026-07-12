const express = require('express');
const router = Router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { z } = require('zod');
const { createNotification, logActivity } = require('../services/notificationService');
const { transitionAssetStatus } = require('../services/assetStatusService');

// Zod schemas
const createAuditSchema = z.object({
  name: z.string().min(1, 'Audit cycle name is required')
});

const assignAuditorsSchema = z.object({
  auditorIds: z.array(z.string()).min(1, 'At least one auditor ID is required')
});

const logDiscrepancySchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  expectedStatus: z.string().min(1, 'Expected status is required'),
  actualStatus: z.string().min(1, 'Actual status is required'),
  notes: z.string().optional()
});

const resolveDiscrepancySchema = z.object({
  resolved: z.boolean()
});

// POST / - Create an audit cycle (Admin only)
router.post('/', auth, requireRole('Admin'), async (req, res) => {
  try {
    const parseResult = createAuditSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { name } = parseResult.data;

    const cycle = await prisma.auditCycle.create({
      data: {
        name,
        status: 'Open',
        createdBy: req.user.userId
      }
    });

    await logActivity(
      req.user.userId,
      'AUDIT_CYCLE_CREATED',
      'AuditCycle',
      cycle.id,
      `Audit cycle: ${name}`
    );

    return res.status(201).json({ data: cycle, error: null });
  } catch (err) {
    console.error('Create audit cycle error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// POST /:id/assign-auditors - Assign auditors to cycle (Admin only)
router.post('/:id/assign-auditors', auth, requireRole('Admin'), async (req, res) => {
  try {
    const parseResult = assignAuditorsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { auditorIds } = parseResult.data;

    const cycle = await prisma.auditCycle.findUnique({ where: { id: req.params.id } });
    if (!cycle) {
      return res.status(404).json({ data: null, error: 'Audit cycle not found' });
    }

    const assignments = [];
    for (const auditorId of auditorIds) {
      // Check employee exists
      const employee = await prisma.employee.findUnique({ where: { id: auditorId } });
      if (!employee) {
        return res.status(404).json({ data: null, error: `Auditor with ID ${auditorId} not found` });
      }

      const assignment = await prisma.auditAssignment.create({
        data: {
          auditCycleId: cycle.id,
          auditorId
        }
      });
      assignments.push(assignment);

      await createNotification(
        auditorId,
        `You have been assigned as an auditor for cycle: ${cycle.name}`,
        'AuditAssigned'
      );
    }

    await logActivity(
      req.user.userId,
      'AUDIT_AUDITORS_ASSIGNED',
      'AuditCycle',
      cycle.id,
      `Assigned ${auditorIds.length} auditors`
    );

    return res.status(201).json({ data: assignments, error: null });
  } catch (err) {
    console.error('Assign auditors error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// POST /:id/discrepancies - Log a discrepancy (Assigned auditor or Admin only)
router.post('/:id/discrepancies', auth, async (req, res) => {
  try {
    const parseResult = logDiscrepancySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { assetId, expectedStatus, actualStatus, notes } = parseResult.data;

    const cycle = await prisma.auditCycle.findUnique({ where: { id: req.params.id } });
    if (!cycle) {
      return res.status(404).json({ data: null, error: 'Audit cycle not found' });
    }

    // Check permissions: must be assigned auditor or Admin
    const assignment = await prisma.auditAssignment.findFirst({
      where: {
        auditCycleId: req.params.id,
        auditorId: req.user.userId
      }
    });

    if (!assignment && req.user.role !== 'Admin') {
      return res.status(403).json({ data: null, error: 'Forbidden: You are not assigned to audit this cycle' });
    }

    // Check asset exists
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      return res.status(404).json({ data: null, error: 'Asset not found' });
    }

    const discrepancy = await prisma.auditDiscrepancy.create({
      data: {
        auditCycleId: cycle.id,
        assetId,
        expectedStatus,
        actualStatus,
        notes,
        resolved: false
      }
    });

    await logActivity(
      req.user.userId,
      'AUDIT_DISCREPANCY_LOGGED',
      'AuditCycle',
      cycle.id,
      `Discrepancy logged for asset: ${asset.tag}. Expected: ${expectedStatus}, Actual: ${actualStatus}`
    );

    return res.status(201).json({ data: discrepancy, error: null });
  } catch (err) {
    console.error('Log discrepancy error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// PATCH /discrepancies/:discrepancyId - Resolve a discrepancy (Admin or Auditor only)
router.patch('/discrepancies/:discrepancyId', auth, async (req, res) => {
  try {
    const parseResult = resolveDiscrepancySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { resolved } = parseResult.data;

    const discrepancy = await prisma.auditDiscrepancy.findUnique({
      where: { id: req.params.discrepancyId },
      include: { auditCycle: true }
    });

    if (!discrepancy) {
      return res.status(404).json({ data: null, error: 'Discrepancy not found' });
    }

    // Check permissions: must be assigned auditor or Admin
    const assignment = await prisma.auditAssignment.findFirst({
      where: {
        auditCycleId: discrepancy.auditCycleId,
        auditorId: req.user.userId
      }
    });

    if (!assignment && req.user.role !== 'Admin') {
      return res.status(403).json({ data: null, error: 'Forbidden: Access denied' });
    }

    const updatedDiscrepancy = await prisma.auditDiscrepancy.update({
      where: { id: req.params.discrepancyId },
      data: { resolved }
    });

    // If resolved is true and actual status was MISSING, transition the asset status to Lost
    if (resolved && (discrepancy.actualStatus.toUpperCase() === 'MISSING' || discrepancy.actualStatus.toUpperCase() === 'LOST')) {
      await transitionAssetStatus(
        discrepancy.assetId,
        'Lost',
        `Asset confirmed missing in audit cycle ${discrepancy.auditCycle.name}`,
        req.user.userId
      );
    }

    await logActivity(
      req.user.userId,
      'AUDIT_DISCREPANCY_RESOLVED',
      'AuditCycle',
      discrepancy.auditCycleId,
      `Discrepancy for asset ${discrepancy.assetId} marked resolved: ${resolved}`
    );

    return res.json({ data: updatedDiscrepancy, error: null });
  } catch (err) {
    console.error('Resolve discrepancy error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// PATCH /:id/close - Close audit cycle (Admin only)
router.patch('/:id/close', auth, requireRole('Admin'), async (req, res) => {
  try {
    const cycle = await prisma.auditCycle.findUnique({ where: { id: req.params.id } });
    if (!cycle) {
      return res.status(404).json({ data: null, error: 'Audit cycle not found' });
    }

    if (cycle.status === 'Closed') {
      return res.status(400).json({ data: null, error: 'Audit cycle is already closed' });
    }

    // Check for unresolved discrepancies
    const unresolvedCount = await prisma.auditDiscrepancy.count({
      where: {
        auditCycleId: req.params.id,
        resolved: false
      }
    });

    if (unresolvedCount > 0) {
      return res.status(400).json({ data: null, error: 'Unresolved discrepancies exist' });
    }

    // Update cycle
    const updatedCycle = await prisma.auditCycle.update({
      where: { id: req.params.id },
      data: {
        status: 'Closed',
        closedDate: new Date()
      }
    });

    // Also auto-transition any MISSING discrepancy assets to 'Lost' if not already done
    const discrepancies = await prisma.auditDiscrepancy.findMany({
      where: { auditCycleId: req.params.id }
    });

    for (const disc of discrepancies) {
      if (disc.actualStatus.toUpperCase() === 'MISSING' || disc.actualStatus.toUpperCase() === 'LOST') {
        const asset = await prisma.asset.findUnique({ where: { id: disc.assetId } });
        if (asset && asset.status !== 'Lost') {
          await transitionAssetStatus(
            disc.assetId,
            'Lost',
            `Asset confirmed missing in closed audit cycle ${cycle.name}`,
            req.user.userId
          );
        }
      }
    }

    await logActivity(
      req.user.userId,
      'AUDIT_CYCLE_CLOSED',
      'AuditCycle',
      cycle.id,
      `Closed audit cycle: ${cycle.name}`
    );

    return res.json({ data: updatedCycle, error: null });
  } catch (err) {
    console.error('Close audit cycle error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// GET /:id/report - Full audit cycle with discrepancies and auditors
router.get('/:id/report', auth, async (req, res) => {
  try {
    const report = await prisma.auditCycle.findUnique({
      where: { id: req.params.id },
      include: {
        auditors: {
          include: {
            auditor: {
              select: { id: true, name: true, email: true, role: true }
            }
          }
        },
        discrepancies: {
          include: {
            asset: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ data: null, error: 'Audit cycle report not found' });
    }

    return res.json({ data: report, error: null });
  } catch (err) {
    console.error('Get audit report error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// GET / - List cycles with optional status filter
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const cycles = await prisma.auditCycle.findMany({
      where,
      orderBy: { startDate: 'desc' }
    });

    return res.json({ data: cycles, error: null });
  } catch (err) {
    console.error('Get audit cycles error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
