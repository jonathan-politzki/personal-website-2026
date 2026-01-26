import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// --- 1. SETUP ---
// We will use Gemini for both embedding (of the user query) and generation (the answer).
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAJ2rvTsjyPE651ysAVKab3Ixi1zZAqPpg"; 

// Only load the vector store once in memory if possible
let VECTOR_STORE: any[] = [];

function getVectorStore() {
  if (VECTOR_STORE.length > 0) return VECTOR_STORE;
  
  const filePath = path.join(process.cwd(), "src/data/vector-store.json");
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      VECTOR_STORE = JSON.parse(data);
      console.log(`[RAG] Loaded ${VECTOR_STORE.length} vectors into memory.`);
    } catch (e) {
      console.error("[RAG] Failed to load vector store:", e);
    }
  }
  return VECTOR_STORE;
}

// --- 2. MATH UTILS ---
function dot(a: number[], b: number[]) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function cosineSimilarity(a: number[], b: number[]) {
  // Assuming vectors are already normalized (usually true for modern embedding models)
  // If not, we'd divide by magnitudes. Gemini embeddings are unit length? Let's assume dot is close enough for ranking.
  return dot(a, b); 
}

// --- 3. API HANDLER ---

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // A. Embed the User Query
    console.log("[RAG] Embedding query:", message);
    const embedResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text: message }] }
      })
    });

    const embedData = await embedResponse.json();
    if (embedData.error) throw new Error(embedData.error.message);
    
    const queryVector = embedData.embedding.values;

    // B. Semantic Search (Cosine Similarity)
    const store = getVectorStore();
    const ranked = store.map(doc => ({
      ...doc,
      score: cosineSimilarity(queryVector, doc.embedding)
    })).sort((a, b) => b.score - a.score);

    // Take top 3-5 chunks
    const topContext = ranked.slice(0, 4);
    
    // Construct Context String
    const contextText = topContext.map((doc: any) => `
    ---
    TITLE: ${doc.title}
    DATE: ${doc.date}
    CONTENT: ${doc.content.slice(0, 1500)}...
    ---
    `).join("\n");

    console.log("[RAG] Top matches:", topContext.map(d => d.title));

    // C. Generate Answer with LLM
    const systemPrompt = `
    You are an AI assistant for Jonathan Politzki's personal website.
    You have access to his entire writing corpus.
    
    Your goal is to answer the user's question using ONLY the provided context from his essays.
    
    Guidelines:
    - If the answer is in the context, answer clearly and cite the essay title.
    - If the answer is NOT in the context, say "I don't see anything about that in Jonathan's writing."
    - Adapt the tone to be helpful but slightly intellectual, mirroring the style of the essays.
    - Be concise.
    
    CONTEXT:
    ${contextText}
    `;

    const chatResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          // Optional: Add history here if we want multi-turn
          { role: "user", parts: [{ text: systemPrompt + "\n\nUSER QUESTION: " + message }] }
        ],
        generationConfig: { responseMimeType: "text/plain" }
      })
    });

    const chatData = await chatResponse.json();
    if (chatData.error) throw new Error(chatData.error.message);

    const answer = chatData.candidates[0].content.parts[0].text;
    const sources = topContext.map((d: any) => ({ title: d.title, slug: d.slug, score: d.score }));

    return NextResponse.json({ 
      role: "assistant", 
      content: answer,
      sources: sources
    });

  } catch (error: any) {
    console.error("[RAG] Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
