// import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// 1. openRouter api call
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENAI_API_KEY,
// });
// async function main() {
//   const completion = await openai.chat.completions.create({
//     model: "openai/gpt-oss-20b:free",
//     messages: [
//       {
//         "role": "user",
//         "content": "What is the meaning of life?"
//       }
//     ],
    
//   });

//   console.log(completion.choices[0].message);
// }

// main();

// 2. google genai api call - Streaming response
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: "explain 20 - 11 in short.",
    config: {
      systemInstruction: "you are a math teacher.",
      temperature : 0.2,
      thinkingConfig: {
        thinkingBudget: 1, // Disables thinking
      },
    },
  });
  for await (const chunk of response) {
    console.log(chunk.text);
  }

// 3. google genai api call - Chat history
  // const chat = await ai.chats.create({
  //   model : "gemini-2.5-flash",
  //   history : [
  //     {
  //       role : "user",
  //       parts : [
  //         {
  //           text : "what is 5 plus 6?"
  //         }
  //       ]
  //     },
  //     {role : "model",
  //     parts : [
  //       {
  //         text : "5 + 6 = 11 karthik"
  //       }
  //     ]
  //     },
  //     {
  //       role : "user",
  //       parts : [
  //         {
  //           text : "what is 8 plus 9?"
  //         }
  //       ]
  //     },
  //     {role : "model",
  //     parts : [
  //       {
  //         text : "8 + 9 = 17 karthik"
  //       }
  //     ]
  //     }
  //     ],
  //     config : {
  //       systemInstruction : "you are a math teacher.",
  //       temperature : 0.1,
  //     }
  //   });

  // const response = await chat.sendMessage({
  //     message : "what is 10 plus 11?"
  // });
  // console.log(response.text);
}

await main();