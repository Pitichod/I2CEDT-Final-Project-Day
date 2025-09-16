// chat.js - Handles logic for Chat tab in SPA
// Manages chat input, history, and chatbot interaction

// Chat tab logic
import { askChat, getChatHistory } from '../api.js';

export function initChatTab() {
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');
  const chatHistory = document.getElementById('chatHistory');
  const userUidBox = document.getElementById('userUidBox');

  // Generate or get userId (simple random for demo)
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  if (userUidBox) userUidBox.textContent = userId;

  // Render chat history
  async function renderChatHistory() {
    chatHistory.innerHTML = '';
    const res = await getChatHistory(userId);
    if (res && res.history && Array.isArray(res.history)) {
      // Simple Markdown to HTML converter for * and **
      function markdownToHtml(text) {
        // Bold (**text**)
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Bullet points (* text)
        text = text.replace(/^\* (.+)$/gm, '<li>$1</li>');
        // Wrap <li> in <ul> if any
        if (text.includes('<li>')) {
          text = text.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
        }
        // Newlines
        text = text.replace(/\n/g, '<br>');
        // Tabs
        text = text.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
        return text;
      }
      res.history.forEach(chat => {
        const userMsg = document.createElement('div');
        userMsg.className = 'msg user';
        userMsg.textContent = chat.message;
        chatHistory.appendChild(userMsg);
        if (chat.response) {
          const botMsg = document.createElement('div');
          botMsg.className = 'msg bot';
          botMsg.innerHTML = markdownToHtml(chat.response);
          chatHistory.appendChild(botMsg);
        }
      });
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  }

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message with loading
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.textContent = message;
    chatHistory.appendChild(userMsg);
    userInput.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Show bot typing animation
    const botLoading = document.createElement('div');
    botLoading.className = 'msg bot';
    botLoading.textContent = 'Bot is typing';
    chatHistory.appendChild(botLoading);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Animate dots
    let dotCount = 0;
    const maxDots = 3;
    let typingInterval = setInterval(() => {
      dotCount = (dotCount + 1) % (maxDots + 1);
      botLoading.textContent = 'Bot is typing' + '.'.repeat(dotCount);
    }, 500);

    // Call backend
    const res = await askChat(userId, message);

    // Remove bot loading and stop animation
    clearInterval(typingInterval);
    chatHistory.removeChild(botLoading);

    // Re-render chat history after sending
    await renderChatHistory();
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  sendBtn.onclick = sendMessage;

  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow new line
      // Default behavior is fine
    }
  });

  // Initial render on tab load
  renderChatHistory();
}
