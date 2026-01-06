import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req) {
  // 1. Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Only POST allowed' }), { status: 405 });
  }

  try {
    // 2. Read the video URL from the request
    const body = await req.json();
    const videoUrl = body.videoUrl;

    if (!videoUrl) {
      return new Response(JSON.stringify({ text: "Error: No URL provided" }), { status: 400 });
    }

    // 3. Get API Key from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ text: "Error: GEMINI_API_KEY is missing in Vercel settings" }), { status: 500 });
    }

    // 4. Start the AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Act as a social media expert. Based on this video link: ${videoUrl}, write 1 LinkedIn post and 1 Twitter post.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // 5. Send back the success package
    return new Response(JSON.stringify({ text: aiText }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    // This logs the real error in Vercel's "Logs" tab
    console.error("CRASH ERROR:", error.message);
    return new Response(JSON.stringify({ text: "AI Error: " + error.message }), { status: 500 });
  }
}
