// server.js - Entry point for backend server
// Starts Express server and connects to MongoDB

const connectDB = require('./config/db');
const app = require('./app');

connectDB();

const HOST = '0.0.0.0';
const PORT = 3222;
app.listen(PORT, HOST, () => {
	console.log(`Backend server running on http://${HOST}:${PORT}`);
});