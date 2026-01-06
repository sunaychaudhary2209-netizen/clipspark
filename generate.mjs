import { GoogleGenerativeAI } from "@google/generative-ai";

// This tells Vercel exactly how to run this file
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Check if it's a POST request
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { videoUrl } = await req.json();
    
    // This grabs your key from the Vercel Settings you filled out earlier
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Act as a social media expert. For this video URL: ${videoUrl}, write one LinkedIn post and one viral Tweet. Use emojis.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'AI Connection Failed', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
