import express from "express"
import dotenv from "dotenv"
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const app = express()
app.use(express.json())

const genai = new GoogleGenAI({});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


