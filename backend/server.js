require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organization');
const assetRoutes = require('./routes/assets');
const allocationRoutes = require('./routes/allocations');
const transferRoutes = require('./routes/transfers');
const bookingRoutes = require('./routes/bookings');
const maintenanceRoutes = require('./routes/maintenance');
const auditRoutes = require('./routes/audits');
const notificationRoutes = require('./routes/notifications');
const activityLogRoutes = require('./routes/activityLogs');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');

app.use('/auth', authRoutes);
app.use('/', organizationRoutes);
app.use('/', assetRoutes);
app.use('/', allocationRoutes);
app.use('/', transferRoutes);
app.use('/bookings', bookingRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/audits', auditRoutes);
app.use('/notifications', notificationRoutes);
app.use('/activity-logs', activityLogRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/reports', reportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ data: { message: 'AssetFlow API is running' }, error: null });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ data: null, error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
