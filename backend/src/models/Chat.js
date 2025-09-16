// Chat.js - Mongoose model for storing chat messages and responses in MongoDB
// Defines the schema for chat logs per user, including message, response, and timestamp
// Used for chat history and chatbot features

const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
