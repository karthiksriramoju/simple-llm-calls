import express from "express"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config();

import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json())
app.use(express.static(__dirname));

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: message,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({
      error: 'Failed to process your request',
      details: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to access the chat interface`);
});


