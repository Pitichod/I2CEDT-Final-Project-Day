// Source.js - Mongoose model for storing source URLs and related info in MongoDB
// Defines the schema for sources used in the chatbot and admin panel
// Fields: url, note, context, addedBy, createdAt
// Used for CRUD operations in sourcesController and sources routes

const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
  url: { type: String, required: true },
  note: { type: String },
  context: { type: String },
  addedBy: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Source', SourceSchema);
