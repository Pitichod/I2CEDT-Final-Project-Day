// Feedback.js - Mongoose model for storing user feedback in MongoDB
// Defines the schema for feedback comments, star ratings, and user info
// Used for collecting and displaying feedback in the Feedback tab

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: { type: String },
  comment: { type: String, required: true },
  stars: { type: Number, min: 1, max: 5 },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
