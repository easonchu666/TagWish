
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeProductImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
            {
              text: "Analyze this product image for a shopping wish. Provide a concise item name, a detailed description, and an estimated retail price in USD. Return as JSON.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedPrice: { type: Type.NUMBER },
            suggestedLocation: { type: Type.STRING },
            tag: { type: Type.STRING }
          },
          required: ["itemName", "description", "estimatedPrice", "suggestedLocation", "tag"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};

export const verifyProductAuthenticity = async (wishDescription: string, travelerPhotoBase64: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: travelerPhotoBase64,
              },
            },
            {
              text: `The buyer requested: "${wishDescription}". Does the product in this photo match the description? Provide a match percentage (0-100) and a brief reasoning. Return as JSON.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            isAuthentic: { type: Type.BOOLEAN }
          },
          required: ["matchScore", "reasoning", "isAuthentic"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Verification Error:", error);
    return { matchScore: 0, reasoning: "Could not verify.", isAuthentic: false };
  }
};

export const generatePriceGuidance = async (itemName: string, reward: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User wants to buy "${itemName}" and is offering a $${reward} reward. Is this a fair reward for a traveler? 1-sentence advice.`,
    });
    return response.text;
  } catch (error) {
    return "Reward looks standard.";
  }
};
