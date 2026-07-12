const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');
const { z } = require('zod');
const { createNotification, logActivity } = require('../services/notificationService');

// Zod schema for creating a booking
const createBookingSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  startTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid start time'
  }),
  endTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid end time'
  }),
  purpose: z.string().optional()
});

// POST /bookings - Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const parseResult = createBookingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        data: null,
        error: parseResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const { assetId, startTime, endTime, purpose } = parseResult.data;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ data: null, error: 'Start time must be before end time' });
    }

    // 1. Check if asset exists and is bookable
    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      return res.status(404).json({ data: null, error: 'Asset not found' });
    }

    if (!asset.isBookable) {
      return res.status(400).json({ data: null, error: 'Asset not bookable' });
    }

    // 2. Check for overlap
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        assetId,
        status: 'Confirmed',
        startTime: { lt: end },
        endTime: { gt: start }
      }
    });

    if (conflictingBooking) {
      return res.status(409).json({
        data: { blocked: true, conflictingBooking },
        error: null
      });
    }

    // 3. Create the booking
    const booking = await prisma.booking.create({
      data: {
        assetId,
        employeeId: req.user.userId,
        startTime: start,
        endTime: end,
        purpose,
        status: 'Confirmed'
      }
    });

    // 4. Notifications & Activity log
    await createNotification(
      req.user.userId,
      `Booking Confirmed for asset ${asset.name} (${asset.tag})`,
      'BookingConfirmed'
    );

    await logActivity(
      req.user.userId,
      'BOOKING_CREATED',
      'Booking',
      booking.id,
      `Booking created for asset: ${asset.name}`
    );

    return res.status(201).json({ data: booking, error: null });
  } catch (err) {
    console.error('Create booking error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// GET /bookings - List bookings with optional filters
router.get('/', auth, async (req, res) => {
  try {
    const { assetId, employeeId, status } = req.query;
    const where = {};

    if (assetId) where.assetId = assetId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        asset: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return res.json({ data: bookings, error: null });
  } catch (err) {
    console.error('Get bookings error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// PATCH /bookings/:id/cancel - Cancel a booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { asset: true }
    });

    if (!booking) {
      return res.status(404).json({ data: null, error: 'Booking not found' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ data: null, error: 'Booking is already cancelled' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'Cancelled' }
    });

    await createNotification(
      booking.employeeId,
      `Booking cancelled for asset ${booking.asset.name}`,
      'BookingCancelled'
    );

    await logActivity(
      req.user.userId,
      'BOOKING_CANCELLED',
      'Booking',
      booking.id,
      `Booking cancelled for asset: ${booking.asset.name}`
    );

    return res.json({ data: updatedBooking, error: null });
  } catch (err) {
    console.error('Cancel booking error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// GET /bookings/calendar - Return confirmed bookings for calendar rendering
router.get('/calendar', auth, async (req, res) => {
  try {
    const { assetId, month, year } = req.query;
    if (!assetId || !month || !year) {
      return res.status(400).json({ data: null, error: 'assetId, month, and year are required' });
    }

    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12 || isNaN(parsedYear)) {
      return res.status(400).json({ data: null, error: 'Invalid month or year values' });
    }

    const startOfMonth = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
    const endOfMonth = new Date(Date.UTC(parsedYear, parsedMonth, 0, 23, 59, 59, 999));

    const bookings = await prisma.booking.findMany({
      where: {
        assetId,
        status: 'Confirmed',
        startTime: { lt: endOfMonth },
        endTime: { gt: startOfMonth }
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    return res.json({ data: bookings, error: null });
  } catch (err) {
    console.error('Get calendar bookings error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
