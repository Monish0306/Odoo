require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'some-random-string-here';

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ data: null, error: 'Name, email, and password are required' });
    }

    const existing = await prisma.employee.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ data: null, error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // ALWAYS create with role="Employee" — role field from req.body is stripped/ignored
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'Employee', // hardcoded, never taken from client
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ data: employee, error: null });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ data: null, error: 'Email and password are required' });
    }

    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) {
      return res.status(401).json({ data: null, error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, employee.passwordHash);
    if (!valid) {
      return res.status(401).json({ data: null, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: employee.id,
        role: employee.role,
        departmentId: employee.departmentId,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    const user = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      departmentId: employee.departmentId,
      status: employee.status,
    };

    return res.json({ data: { token, user }, error: null });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// POST /auth/forgot-password — stub only, logs token to console
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ data: null, error: 'Email is required' });
    }

    const employee = await prisma.employee.findUnique({ where: { email } });

    // Always return success to prevent user enumeration
    if (employee) {
      const resetToken = jwt.sign(
        { userId: employee.id, purpose: 'reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      console.log(`[PASSWORD RESET] Token for ${email}: ${resetToken}`);
    }

    return res.json({
      data: { message: 'If that email exists, a password reset link has been sent.' },
      error: null,
    });
  } catch (err) {
    console.error('Forgot-password error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// GET /auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
        status: true,
        createdAt: true,
        department: {
          select: { id: true, name: true },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ data: null, error: 'User not found' });
    }

    return res.json({ data: employee, error: null });
  } catch (err) {
    console.error('Auth/me error:', err);
    return res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

module.exports = router;
