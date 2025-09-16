// sourceController.js - Handles Sources CRUD operations
// Manages creation, update, and retrieval of source entries

const Source = require('../models/Source');

exports.createSource = async (req, res) => {
  try {
    const { url, note, context, adminToken } = req.body;
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({ error: 'Invalid admin token' });
    }
    if (!url) return res.status(400).json({ error: 'URL required' });
    const source = new Source({ url, note, context });
    await source.save();
    res.status(201).json(source);
  } catch (err) {
    console.error('Source Create Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSource = async (req, res) => {
  try {
    const { url, note, context, adminToken } = req.body;
    const id = req.params.id;
    console.log('[SOURCE UPDATE] id:', id, 'url:', url, 'note:', note, 'context:', context, 'adminToken:', adminToken);
    if (adminToken !== process.env.ADMIN_TOKEN) {
      console.log('[SOURCE UPDATE] Invalid admin token:', adminToken);
      return res.status(403).json({ error: 'Invalid admin token' });
    }
    if (!id) {
      console.log('[SOURCE UPDATE] Missing Source id');
      return res.status(400).json({ error: 'Source id required' });
    }
    const source = await Source.findByIdAndUpdate(id, { url, note, context }, { new: true });
    if (!source) {
      console.log('[SOURCE UPDATE] Source not found for id:', id);
      return res.status(404).json({ error: 'Source not found' });
    }
    console.log('[SOURCE UPDATE] Success:', source);
    res.json(source);
  } catch (err) {
    console.error('Source Update Error:', err);
    res.status(500).json({ error: err.message });
  }
};
