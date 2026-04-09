const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateTaskWithAI = async (prompt) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const fullPrompt = `Based on the following request: "${prompt}", generate a JSON object for a task.
  The JSON must have:
  - title: A concise summary.
  - description: Detailed instructions.
  - priority: one of ["low", "medium", "high"].
  - tags: an array of relevant strings.
  Return only the JSON string.`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from potential markdown markers
  const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
  return JSON.parse(jsonStr);
};

module.exports = { generateTaskWithAI };
