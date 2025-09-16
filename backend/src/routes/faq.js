// faq.js - Express routes for FAQ features
// Defines endpoints for FAQ CRUD operations

const express = require('express');
const router = express.Router();
const { createFaq, updateFaq } = require('../controllers/faqController');
const Faq = require('../models/Faq');

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create FAQ
router.post('/', createFaq);

// Update FAQ
router.put('/:id', updateFaq);

// Delete FAQ
router.delete('/:id', async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
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
