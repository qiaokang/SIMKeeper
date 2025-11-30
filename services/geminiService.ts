import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey });

export const askAiAssistant = async (query: string, history: string[]): Promise<string> => {
  if (!apiKey) return "Please provide an API Key to use the assistant.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful assistant for a UK Mobile SIM management app (specifically focused on giffgaff users but applicable to others).
      
      User Query: ${query}
      
      Knowledge Context:
      - Giffgaff SIMs deactivate after 6 months of no usage.
      - "Usage" is defined as: making a call, sending an SMS, or using data. receiving calls/texts does NOT count.
      - Toping up credit also counts.
      - Buying a goodybag counts.
      
      Provide a concise, helpful answer.`,
    });
    return response.text || "I couldn't process that request right now.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I'm having trouble connecting to the network right now.";
  }
};