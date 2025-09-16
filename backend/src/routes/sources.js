// sources.js - Express routes for sources features
// Defines endpoints for sources CRUD operations
const express = require('express');
const router = express.Router();
const { createSource, updateSource } = require('../controllers/sourceController');
const Source = require('../models/Source');

// Get all sources
router.get('/', async (req, res) => {
  try {
    const sources = await Source.find();
    res.json(sources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create source
router.post('/', createSource);

// Update source
router.put('/:id', updateSource);

// Delete source
router.delete('/:id', async (req, res) => {
  try {
    await Source.findByIdAndDelete(req.params.id);
    res.json({ message: 'Source deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin token verification endpoint
router.get('/verify-admin', (req, res) => {
  const { adminToken } = req.query;
  if (adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Invalid admin token' });
  }
  res.json({ success: true });
});

module.exports = router;
