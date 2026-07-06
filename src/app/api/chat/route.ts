import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const client = new Anthropic();

const MODEL = "claude-opus-4-8";
const CONTENT_DIR = path.join(process.cwd(), "src/content/writing");
const SUMMARIES_PATH = path.join(process.cwd(), "src/data/essay-summaries.json");

type EssaySummary = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

let SUMMARIES: EssaySummary[] = [];

function getSummaries(): EssaySummary[] {
  if (SUMMARIES.length > 0) return SUMMARIES;
  SUMMARIES = JSON.parse(fs.readFileSync(SUMMARIES_PATH, "utf-8"));
  return SUMMARIES;
}

function readEssay(slug: string): string | null {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const { content } = matter(fs.readFileSync(fullPath, "utf-8"));
  return content.slice(0, 8000);
}

async function selectEssays(question: string): Promise<string[]> {
  const catalog = getSummaries()
    .map((e) => `- ${e.slug}: "${e.title}" (${e.date}) — ${e.summary}`)
    .join("\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            slugs: {
              type: "array",
              items: { type: "string" },
              description:
                "Slugs of the essays most relevant to the question, best first. At most 4. Empty if nothing is relevant.",
            },
          },
          required: ["slugs"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "user",
        content: `Here is a catalog of Jonathan Politzki's essays:\n\n${catalog}\n\nA visitor to his website asked: "${question}"\n\nSelect the essays (at most 4) whose full text is most likely to answer this question.`,
      },
    ],
  });

  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") return [];
  const known = new Set(getSummaries().map((e) => e.slug));
  const { slugs } = JSON.parse(block.text) as { slugs: string[] };
  return slugs.filter((s) => known.has(s)).slice(0, 4);
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = (await req.json()) as {
      message?: string;
      history?: HistoryMessage[];
    };

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const slugs = await selectEssays(message);
    const summariesBySlug = new Map(getSummaries().map((e) => [e.slug, e]));

    const essays = slugs
      .map((slug) => {
        const text = readEssay(slug);
        const meta = summariesBySlug.get(slug);
        if (!text || !meta) return null;
        return `<essay title="${meta.title}" date="${meta.date}">\n${text}\n</essay>`;
      })
      .filter(Boolean)
      .join("\n\n");

    const system = `You are the AI voice of Jonathan Politzki's personal website. You answer visitors' questions on his behalf, grounded in his essays.

Guidelines:
- Answer ONLY from the essays provided below. Speak about Jonathan in the third person ("Jonathan thinks...") and name the essay you're drawing from.
- If the essays don't cover the question, say "I don't see anything about that in Jonathan's writing" and mention what he HAS written about that comes closest.
- Mirror the intellectual but plainspoken tone of the essays. Be concise — a short paragraph or two.

ESSAYS:
${essays || "(no relevant essays found)"}`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [
        ...history.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user" as const, content: message },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const answer =
      textBlock && textBlock.type === "text" ? textBlock.text : "";

    return NextResponse.json({
      role: "assistant",
      content: answer,
      sources: slugs.map((slug) => ({
        slug,
        title: summariesBySlug.get(slug)?.title ?? slug,
      })),
    });
  } catch (error) {
    console.error("[chat] Error:", error);
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "The AI backend is not configured (missing API key)." },
        { status: 500 },
      );
    }
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
