// Faq.js - Mongoose model for storing FAQ entries in MongoDB
// Defines the schema for questions and answers shown in the FAQ tab
// Used for CRUD operations in faqController and FAQ routes

const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

module.exports = mongoose.model('Faq', FaqSchema);
