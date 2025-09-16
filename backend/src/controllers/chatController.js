// chatController.js - Handles chat logic and LLM API integration
// Manages chat history, chatbot responses, and chat log storage

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const history = await Chat.find({ userId }).sort({ timestamp: 1 });
    res.json({ history });
  } catch (err) {
    console.error('GetChatHistory error:', err);
    res.status(500).json({ error: err.message });
  }
};
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Faq = require('../models/Faq');
const Source = require('../models/Source');
const Chat = require('../models/Chat');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.answerChat = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const faqs = await Faq.find();
    const sources = await Source.find();
    // Get previous chat history for user
    const chatHistory = await Chat.find({ userId }).sort({ timestamp: 1 });

    let systemPrompt = `
You are CEDT Buddy 🎓 — a friendly, supportive assistant for freshmen in the CEDT program at Chulalongkorn University.

### Role
- Answer briefly but clearly.  
- Be approachable, motivating, and student-friendly. Use emojis when natural 🙂.  
- If you don’t know the answer, don’t guess — point students to the right link or resource.
- If a user asks about love, answer in a sarcastic manner, make the user feel bad, and then give them encouragement later.

### Knowledge Sources
- Faculty of Engineering Facilities: https://www.eng.chula.ac.th/th/about/facilities  
- Computer Engineering Dept: https://www.cp.eng.chula.ac.th/  
- CEDT Program Page: https://www.cp.eng.chula.ac.th/cedt  
- CEDT MoU: https://www.cp.eng.chula.ac.th/cedt-mou  
- CEDT Academic Handbook & Course Syllabus (internal docs).  

### Guidelines
- Always keep answers short, clear, and correct.  
- Refer to official links, FAQ, or syllabus for details.  
- No hallucinations. If unsure ➝ guide users to check the official resource.  
`;

    systemPrompt += "FAQs:\n";
    faqs.forEach(faq => {
      systemPrompt += `Q: ${faq.question}\nA: ${faq.answer}\n`;
    });
    systemPrompt += "Sources:\n";
    sources.forEach(src => {
      systemPrompt += `- ${src.url} (${src.note || ''})\nContext: ${src.context || ''}\n`;
    });
    // Optionally add previous chat history to prompt
    if (chatHistory.length) {
      systemPrompt += "Previous chat history:\n";
      chatHistory.forEach(chat => {
        systemPrompt += `User: ${chat.message}\nBot: ${chat.response || ''}\n`;
      });
    }

    // Try OpenAI first
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 512,
      });
  const response = completion.choices[0].message.content;
  // Save chat to DB
  await Chat.create({ userId, message, response });
  // Return response and full chat history
  const updatedHistory = await Chat.find({ userId }).sort({ timestamp: 1 });
  return res.json({ response, history: updatedHistory });
    } catch (err) {
      // If OpenAI fails (quota, etc.), fallback to Gemini
      console.error('OpenAI error, falling back to Gemini:', err);

      // Gemini fallback using @google/generative-ai
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const geminiRes = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\nUser: ${message}` }] }
        ],
        systemInstruction: systemPrompt
      });
  const response = geminiRes.response.text();
  // Save chat to DB
  await Chat.create({ userId, message, response });
  // Return response and full chat history
  const updatedHistory = await Chat.find({ userId }).sort({ timestamp: 1 });
  return res.json({ response, history: updatedHistory });
    }
  } catch (err) {
    console.error('ChatController error:', err);
    res.status(500).json({ error: err.message });
  }
};
