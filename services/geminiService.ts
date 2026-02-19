
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

// Always initialize with the exact environment variable as specified in the guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePlantDisease = async (base64Image: string): Promise<ScanResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1],
            },
          },
          {
            text: "Analyze this plant leaf image. Identify the crop type and detect if there is any disease. Provide the name of the disease, confidence level (0-1), a detailed description, treatment steps, and preventative measures. Return the result strictly in JSON format.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            cropType: { type: Type.STRING },
            description: { type: Type.STRING },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            severity: { 
              type: Type.STRING, 
              description: "The severity level of the disease: Low, Moderate, High, or Critical" 
            },
          },
          required: ["diseaseName", "confidence", "cropType", "description", "treatment", "prevention", "severity"]
        },
      },
    });

    // Directly access the .text property (not a method)
    const resultStr = response.text;
    if (!resultStr) throw new Error("No response from AI");
    
    return JSON.parse(resultStr) as ScanResult;
  } catch (error) {
    console.error("Diagnosis failed:", error);
    throw error;
  }
};
