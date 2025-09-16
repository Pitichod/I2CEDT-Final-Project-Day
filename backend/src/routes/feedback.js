// feedback.js - Express routes for feedback features
// Defines endpoints for feedback submission and retrieval

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { sendFeedback } = require('../controllers/fbController');

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create feedback
router.post('/', sendFeedback);

// Update feedback by user
const { updateFeedback, deleteFeedback } = require('../controllers/fbController');
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;
