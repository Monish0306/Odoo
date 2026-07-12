const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { z } = require('zod');
const { createNotification, logActivity } = require('../services/notificationService');
const { transitionAssetStatus } = require('../services/assetStatusService');

// Zod schemas
const createRequestSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  issueDescription: z.string().min(1, 'Issue description is required')
});

const approveRequestSchema = z.object({
  assignedTo: z.string().min(1, 'Assigned technician ID is required')
});

const rejectRequestSchema = z.object({
  reason: z.string().min(1, 'Reason for rejection is required')
});

const resolveRequestSchema = z.object({
  resolutionNotes: z.string().min(1, 'Resolution notes are required')
});

// POST / - Report a new maintenance request
router.post('/', auth, async (req, res) => {
  try {
    const parseResult = createRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { assetId, issueDescription } = parseResult.data;

    // Check if asset exists
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      return res.status(404).json({ data: null, error: 'Asset not found' });
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        assetId,
        reportedBy: req.user.userId,
        issueDescription,
        status: 'Pending'
      }
    });

    // Notify admins and asset managers
    const managers = await prisma.employee.findMany({
      where: { role: { in: ['Admin', 'AssetManager'] } }
    });

    for (const manager of managers) {
      await createNotification(
        manager.id,
        `New maintenance request raised for ${asset.name} (${asset.tag})`,
        'MaintenanceReported'
      );
    }

    await logActivity(
      req.user.userId,
      'MAINTENANCE_CREATED',
      'MaintenanceRequest',
      request.id,
      `Reported issue: ${issueDescription}`
    );

    return res.status(201).json({ data: request, error: null });
  } catch (err) {
    console.error('Create maintenance request error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// PATCH /:id/approve - Approve request and assign technician (Admin/AssetManager only)
router.patch('/:id/approve', auth, requireRole('Admin', 'AssetManager'), async (req, res) => {
  try {
    const parseResult = approveRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { assignedTo } = parseResult.data;

    const request = await prisma.maintenanceRequest.findUnique({ where: { id: req.params.id } });
    if (!request) {
      return res.status(404).json({ data: null, error: 'Maintenance request not found' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ data: null, error: 'Only Pending requests can be approved' });
    }

    // Check technician exists
    const technician = await prisma.employee.findUnique({ where: { id: assignedTo } });
    if (!technician) {
      return res.status(404).json({ data: null, error: 'Assigned technician not found' });
    }

    // Update request
    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'Assigned',
        approvedBy: req.user.userId,
        assignedTo
      }
    });

    // Flip asset status
    await transitionAssetStatus(
      request.assetId,
      'UnderMaintenance',
      `Maintenance request ${request.id} approved`,
      req.user.userId
    );

    // Notify technician
    await createNotification(
      assignedTo,
      `You have been assigned maintenance request ${request.id}`,
      'MaintenanceAssigned'
    );

    // Notify reporter
    await createNotification(
      request.reportedBy,
      `Your maintenance request for asset has been approved and assigned`,
      'MaintenanceStatusChanged'
    );

    await logActivity(
      req.user.userId,
      'MAINTENANCE_APPROVED',
      'MaintenanceRequest',
      request.id,
      `Assigned to ${technician.name}`
    );

    return res.json({ data: updatedRequest, error: null });
  } catch (err) {
    console.error('Approve maintenance request error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// PATCH /:id/reject - Reject request (Admin/AssetManager only)
router.patch('/:id/reject', auth, requireRole('Admin', 'AssetManager'), async (req, res) => {
  try {
    const parseResult = rejectRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { reason } = parseResult.data;

    const request = await prisma.maintenanceRequest.findUnique({ where: { id: req.params.id } });
    if (!request) {
      return res.status(404).json({ data: null, error: 'Maintenance request not found' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ data: null, error: 'Only Pending requests can be rejected' });
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'Rejected',
        resolutionNotes: reason
      }
    });

    // Notify reporter
    await createNotification(
      request.reportedBy,
      `Your maintenance request has been rejected. Reason: ${reason}`,
      'MaintenanceStatusChanged'
    );

    await logActivity(
      req.user.userId,
      'MAINTENANCE_REJECTED',
      'MaintenanceRequest',
      request.id,
      `Rejection reason: ${reason}`
    );

    return res.json({ data: updatedRequest, error: null });
  } catch (err) {
    console.error('Reject maintenance request error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// PATCH /:id/start - Start work on request (Assigned technician only)
router.patch('/:id/start', auth, async (req, res) => {
  try {
    const request = await prisma.maintenanceRequest.findUnique({ where: { id: req.params.id } });
    if (!request) {
      return res.status(404).json({ data: null, error: 'Maintenance request not found' });
    }

    if (request.assignedTo !== req.user.userId) {
      return res.status(403).json({ data: null, error: 'Forbidden: Only the assigned technician can start work' });
    }

    if (request.status !== 'Assigned') {
      return res.status(400).json({ data: null, error: 'Only Assigned requests can be started' });
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data: { status: 'InProgress' }
    });

    // Notify reporter
    await createNotification(
      request.reportedBy,
      `Work has started on your maintenance request ${request.id}`,
      'MaintenanceStatusChanged'
    );

    await logActivity(
      req.user.userId,
      'MAINTENANCE_STARTED',
      'MaintenanceRequest',
      request.id,
      'Technician started work'
    );

    return res.json({ data: updatedRequest, error: null });
  } catch (err) {
    console.error('Start maintenance request error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// PATCH /:id/resolve - Resolve request (Assigned technician only)
router.patch('/:id/resolve', auth, async (req, res) => {
  try {
    const parseResult = resolveRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { resolutionNotes } = parseResult.data;

    const request = await prisma.maintenanceRequest.findUnique({ where: { id: req.params.id } });
    if (!request) {
      return res.status(404).json({ data: null, error: 'Maintenance request not found' });
    }

    if (request.assignedTo !== req.user.userId) {
      return res.status(403).json({ data: null, error: 'Forbidden: Only the assigned technician can resolve work' });
    }

    if (request.status !== 'InProgress') {
      return res.status(400).json({ data: null, error: 'Only In-Progress requests can be resolved' });
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'Resolved',
        resolutionNotes,
        resolvedAt: new Date()
      }
    });

    // Flip asset status back to Available
    await transitionAssetStatus(
      request.assetId,
      'Available',
      `Maintenance resolved: ${resolutionNotes}`,
      req.user.userId
    );

    // Notify reporter
    await createNotification(
      request.reportedBy,
      `Your maintenance request ${request.id} has been resolved! Notes: ${resolutionNotes}`,
      'MaintenanceResolved'
    );

    await logActivity(
      req.user.userId,
      'MAINTENANCE_RESOLVED',
      'MaintenanceRequest',
      request.id,
      `Resolution notes: ${resolutionNotes}`
    );

    return res.json({ data: updatedRequest, error: null });
  } catch (err) {
    console.error('Resolve maintenance request error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// GET / - List maintenance requests with filters
router.get('/', auth, async (req, res) => {
  try {
    const { status, assetId, assignedTo } = req.query;
    const where = {};

    if (status) where.status = status;
    if (assetId) where.assetId = assetId;
    if (assignedTo) where.assignedTo = assignedTo;

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        asset: true,
        reporter: {
          select: { id: true, name: true, email: true }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return res.json({ data: requests, error: null });
  } catch (err) {
    console.error('Get maintenance requests error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
