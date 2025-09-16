// app.js - Main Express application setup
// Configures middleware, routes, and error handling for backend API

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/faq', require('./routes/faq'));
app.use('/api/sources', require('./routes/sources'));
app.use('/api/feedback', require('./routes/feedback'));

module.exports = app;
