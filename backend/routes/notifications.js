const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');

// GET / - Get current user's notifications (most recent first)
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { employeeId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ data: notifications, error: null });
  } catch (err) {
    console.error('Get notifications error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// PATCH /:id/read - Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id }
    });

    if (!notification) {
      return res.status(404).json({ data: null, error: 'Notification not found' });
    }

    if (notification.employeeId !== req.user.userId) {
      return res.status(403).json({ data: null, error: 'Forbidden: Access denied' });
    }

    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    return res.json({ data: updated, error: null });
  } catch (err) {
    console.error('Read notification error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
