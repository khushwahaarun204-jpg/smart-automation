const express = require('express');
const { successResponse } = require('../utils/response');
const { checkDatabaseConnection } = require('../config/supabase');

const router = express.Router();

router.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseConnection();

  return successResponse(res, 'Smart Automation API is healthy and operational', {
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: dbHealth.connected,
      provider: dbHealth.provider || 'PostgreSQL',
      error: dbHealth.error || null
    }
  });
});

module.exports = router;

