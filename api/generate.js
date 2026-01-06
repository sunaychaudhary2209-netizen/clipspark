import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // This looks at your .env file for the key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const { videoUrl } = req.body;

  try {
    const prompt = `Act as a social media expert. For this video URL: ${videoUrl}, write one LinkedIn post and one viral Tweet. Use emojis.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: "Failed to reach AI" });
  }
}

