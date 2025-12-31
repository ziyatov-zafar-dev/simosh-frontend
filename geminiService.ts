
import { GoogleGenAI } from "@google/genai";
import { getSystemInstruction, TRANSLATIONS } from "./constants";
import { Message, Language, Product, AboutInfo } from "./types";

export const getGeminiResponse = async (
  history: Message[], 
  lang: Language, 
  products?: Product[], 
  aboutInfo?: AboutInfo | null,
  imageData?: string // base64 encoded image
) => {
  try {
    if (!process.env.API_KEY) {
      return "Error: API key not found in environment.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userMessage = history[history.length - 1].text;
    
    // Formatting history for Gemini
    const chatHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model' as const,
      parts: [{ text: msg.text }]
    }));

    // If there is an image, we use generateContent directly for multimodal
    if (imageData) {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: imageData, mimeType: 'image/jpeg' } },
              { text: userMessage || "Ushbu rasmni tahlil qiling va sovun tavsiya qiling." }
            ]
          }
        ],
        config: {
          systemInstruction: getSystemInstruction(lang, products, aboutInfo),
        }
      });
      return result.text || TRANSLATIONS[lang]?.ai?.error || "Error";
    }

    // Standard text chat session
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: getSystemInstruction(lang, products, aboutInfo),
        temperature: 0.7,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || (TRANSLATIONS[lang]?.ai?.error || TRANSLATIONS['uz'].ai.error);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.status === 429) return TRANSLATIONS[lang]?.ai?.quotaError || "Limit error";
    return TRANSLATIONS[lang]?.ai?.error || "Error";
  }
};
