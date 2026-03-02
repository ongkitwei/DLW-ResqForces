"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

export async function classifyEmergency(base64Image) 
{
  try {
    const base64Data = base64Image.split(",")[1];

    const prompt = `
      Act as an emergency dispatcher. Analyze this image.
      Classify as: "HIGH RISK" (Fire, accident, weapon, medical) or "LOW RISK".
      Return strictly a JSON object: { "rank": "...", "reason": "..." }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    return JSON.parse(result.response.text().replace(/```json|```/g, ""));
  } catch (error) {
    console.error("AI Error:", error);
    return { error: "Failed to analyze" };
  }
}