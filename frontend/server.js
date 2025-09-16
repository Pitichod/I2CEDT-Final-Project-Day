// server.js - Static file server for frontend
// Serves HTML, CSS, and JS files for SPA
// This file is responsible for setting up a static file server 
// using Node.js and Express. It serves the frontend files for 
// the Single Page Application (SPA), including HTML, CSS, and 
// JavaScript files. The server is configured to handle routing 
// and fallback to the index.html for any unknown routes, 
// enabling the SPA to function correctly.

const express = require('express');
const path = require('path');

const app = express();
const HOST = '0.0.0.0';
const PORT = 3221;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle routing for the SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Frontend server is running on http://${HOST}:${PORT}`);
});
