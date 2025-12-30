
import { GoogleGenAI } from "@google/genai";
import { getSystemInstruction } from "./constants";
import { Message, Language, Product, AboutInfo } from "./types";

export const getGeminiResponse = async (history: Message[], lang: Language, products?: Product[], aboutInfo?: AboutInfo | null) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userMessage = history[history.length - 1].text;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: getSystemInstruction(lang, products, aboutInfo),
        temperature: 0.7,
      },
    });

    return response.text || "Error getting response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. Please try again later.";
  }
};
