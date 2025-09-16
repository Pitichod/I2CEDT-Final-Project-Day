// chat.js - Express routes for chat features
// Defines endpoints for chatbot, chat history, and chat log storage

const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { answerChat, getChatHistory } = require('../controllers/chatController');

// Get all chat messages
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create chat message
router.post('/', async (req, res) => {
  try {
    const { userId, message, response } = req.body;
    const chat = new Chat({ userId, message, response });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Chatbot answer endpoint
router.post('/ask', answerChat);

// Get chat history for a user
router.get('/history', getChatHistory);

module.exports = router;
