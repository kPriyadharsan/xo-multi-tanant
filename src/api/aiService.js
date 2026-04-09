import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "AIzaSy..."); // Placeholder API key

export const generateTaskAI = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const fullPrompt = `Generate a JSON object for a task management system based on this concept: "${prompt}". 
    The object must include:
    - title: String (concise)
    - description: String (detailed)
    - priority: String (one of: low, medium, high)
    - tags: Array of strings
    Return ONLY pure JSON.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handling potential markdown blocks)
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation failed:", error);
    // Fallback if API fails or No Key
    return {
      title: "Generated: " + prompt,
      description: "AI-suggested details based on your input: " + prompt,
      priority: "medium",
      tags: ["ai-suggested"]
    };
  }
};
