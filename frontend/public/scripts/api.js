// Update feedback
export async function updateFeedback(id, data) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/feedback/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}

// Delete feedback
export async function deleteFeedback(id, data) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/feedback/${id}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}
// api.js - Frontend API functions for communicating with backend
// Handles CRUD requests for chat, FAQ, sources, feedback, and chatbot

// API functions for MongoDB CRUD
import { CONFIG } from './config.js';

// --- FAQ ---
export async function getFaqs() {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/faq`);
	return res.json();
}
export async function createFaq(data) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/faq`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}
export async function updateFaq(id, data) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/faq/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}
export async function deleteFaq(id, adminToken) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/faq/${id}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ adminToken })
	});
	return res.json();
}

// --- Sources ---
export async function getSources() {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/sources`);
	return res.json();
}
export async function createSource(data) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/sources`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}
export async function updateSource(id, data) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/sources/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}
export async function deleteSource(id, adminToken) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/sources/${id}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ adminToken })
	});
	return res.json();
}

// --- Feedback ---
export async function getFeedback() {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/feedback`);
	return res.json();
}
export async function createFeedback(data) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/feedback`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}

// --- Chat ---
export async function getChats() {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/chat`);
	return res.json();
}
export async function createChat(data) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/chat`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}

// Get chat history for a user
export async function getChatHistory(userId) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/chat/history?userId=${encodeURIComponent(userId)}`);
	return res.json();
}

// OpenAI chatbot endpoint
export async function askChat(userId, message) {
	const res = await fetch(`${CONFIG.BACKEND_URL}/api/chat/ask`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userId, message })
	});
	return res.json();
}
