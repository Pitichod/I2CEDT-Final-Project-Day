// faqController.js - Handles FAQ CRUD operations
// Manages creation, update, and retrieval of FAQ entries

const Faq = require('../models/Faq');

exports.createFaq = async (req, res) => {
  try {
    const { question, answer, adminToken } = req.body;
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({ error: 'Invalid admin token' });
    }
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer required' });
    const faq = new Faq({ question, answer });
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    console.error('FAQ Create Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { question, answer, adminToken } = req.body;
    const id = req.params.id;
    console.log('[FAQ UPDATE] id:', id, 'question:', question, 'answer:', answer, 'adminToken:', adminToken);
    if (adminToken !== process.env.ADMIN_TOKEN) {
      console.log('[FAQ UPDATE] Invalid admin token:', adminToken);
      return res.status(403).json({ error: 'Invalid admin token' });
    }
    if (!id) {
      console.log('[FAQ UPDATE] Missing FAQ id');
      return res.status(400).json({ error: 'FAQ id required' });
    }
    const faq = await Faq.findByIdAndUpdate(id, { question, answer }, { new: true });
    if (!faq) {
      console.log('[FAQ UPDATE] FAQ not found for id:', id);
      return res.status(404).json({ error: 'FAQ not found' });
    }
    console.log('[FAQ UPDATE] Success:', faq);
    res.json(faq);
  } catch (err) {
    console.error('FAQ Update Error:', err);
    res.status(500).json({ error: err.message });
  }
};
