
import { GoogleGenAI } from "@google/genai";
import { getSystemInstruction, TRANSLATIONS } from "./constants";
import { Message, Language, Product, AboutInfo } from "./types";

export const getGeminiResponse = async (history: Message[], lang: Language, products?: Product[], aboutInfo?: AboutInfo | null) => {
  try {
    if (!process.env.API_KEY) {
      return "Error: API key not found in environment.";
    }

    // Direct initialization using process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Get last message
    const userMessage = history[history.length - 1].text;
    
    // Format history for Gemini
    const chatHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model' as const,
      parts: [{ text: msg.text }]
    }));

    // Create chat session
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: getSystemInstruction(lang, products, aboutInfo),
        temperature: 0.7,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: userMessage });
    
    // Access result.text property directly as per guidelines
    return result.text || (TRANSLATIONS[lang]?.ai?.error || TRANSLATIONS['uz'].ai.error);
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // Detect 429 error (Quota exceeded)
    if (error.status === 429 || error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      return TRANSLATIONS[lang]?.ai?.quotaError || TRANSLATIONS['uz'].ai.quotaError;
    }
    
    if (error.message?.includes("API_KEY_INVALID")) {
      return "Error: Invalid API key.";
    }
    
    return TRANSLATIONS[lang]?.ai?.error || TRANSLATIONS['uz'].ai.error;
  }
};
