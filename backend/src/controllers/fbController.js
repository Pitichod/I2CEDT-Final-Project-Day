// fbController.js - Handles feedback submission
// Manages storing and retrieving user feedback

const Feedback = require('../models/Feedback');

exports.sendFeedback = async (req, res) => {
  try {
    const { name, comment, stars, userId } = req.body;
    if (!comment || !stars || !userId) return res.status(400).json({ error: 'Comment, stars, and userId required' });
    const feedback = new Feedback({ name, comment, stars, userId });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error('Feedback Send Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update feedback by userId and feedback _id
exports.updateFeedback = async (req, res) => {
  try {
    const { name, comment, stars, userId } = req.body;
    const id = req.params.id;
    if (!id || !userId) return res.status(400).json({ error: 'Feedback id and userId required' });
    const feedback = await Feedback.findOneAndUpdate({ _id: id, userId }, { name, comment, stars }, { new: true });
    if (!feedback) return res.status(404).json({ error: 'Feedback not found or not owned by user' });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete feedback by userId and feedback _id
exports.deleteFeedback = async (req, res) => {
  try {
    const { userId } = req.body;
    const id = req.params.id;
    if (!id || !userId) return res.status(400).json({ error: 'Feedback id and userId required' });
    const feedback = await Feedback.findOneAndDelete({ _id: id, userId });
    if (!feedback) return res.status(404).json({ error: 'Feedback not found or not owned by user' });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
