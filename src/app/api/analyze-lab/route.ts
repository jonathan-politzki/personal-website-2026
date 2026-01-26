import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Helper to get specific essay content
function getEssayContent(slug: string) {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/writing');
    const filePath = path.join(contentDir, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) return null;
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return `TITLE: ${data.title}\nCONTENT:\n${content.slice(0, 10000)}\n---\n`; // Limit context per essay
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { slugs, prompt, externalText } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // 1. Gather Context
    let context = "";
    
    // Add selected essays
    if (slugs && Array.isArray(slugs)) {
      slugs.forEach((slug: string) => {
        const text = getEssayContent(slug);
        if (text) context += text;
      });
    }

    // Add external text if provided
    if (externalText) {
      context += `EXTERNAL TEXT:\n${externalText.slice(0, 10000)}\n---\n`;
    }

    if (!context) {
      return NextResponse.json({ content: "No context provided." });
    }

    // 2. Construct Analysis Prompt
    const systemPrompt = `You are a synthesis engine. Your job is to extract and blend ideas, not summarize or compare mechanically.

USER QUESTION: "${prompt}"

TEXTS:
${context}

INSTRUCTIONS:
1. First, identify the **core insight** each text contributes to answering the question
2. Then **synthesize** these into a unified perspective - what emerges when you blend these ideas?
3. Use **bold** for key concepts and terms

FORMAT:
- 2-3 short paragraphs max
- Don't list "Text A says X, Text B says Y" - actually synthesize
- Write like you're explaining an insight to a smart friend
- If there's genuine tension between ideas, name it clearly

BAD OUTPUT: "Essay 1 views boldness as courage while Essay 2 sees it as foolishness..."
GOOD OUTPUT: "Boldness emerges here as **calculated risk-taking** - not recklessness, but the willingness to act on conviction when others hesitate. The key distinction is..."

Be direct. Extract the juice.`;

    // 3. Call Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Gemini API Error");
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis failed.";

    return NextResponse.json({ content: reply });

  } catch (error: any) {
    console.error("Lab API Error:", error);
    // Return the actual error message to the frontend for debugging
    return NextResponse.json({ content: `Analysis Failed: ${error.message}` });
  }
}
