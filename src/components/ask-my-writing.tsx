"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

type Source = { title: string; slug: string };

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const suggestions = [
  "What is Politzki's Law?",
  "Why did Jonathan start Jean?",
  "What does he think about AI memory?",
];

export default function AskMyWriting() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content, sources: data.sources },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        50,
      );
    }
  }

  return (
    <div className="rounded-md border border-rule bg-white/60 p-5 md:p-6">
      {messages.length === 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-rule px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div className="mb-5 max-h-96 space-y-5 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i}>
              {m.role === "user" ? (
                <p className="font-medium">{m.content}</p>
              ) : (
                <div className="border-l-2 border-rule pl-4">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {m.content}
                  </p>
                  {m.sources && m.sources.length > 0 && (
                    <p className="mt-2 text-sm text-muted">
                      From:{" "}
                      {m.sources.slice(0, 3).map((s, j) => (
                        <React.Fragment key={s.slug}>
                          {j > 0 && " · "}
                          <Link
                            href={`/writing/${s.slug}`}
                            className="text-accent hover:underline hover:underline-offset-4"
                          >
                            {s.title}
                          </Link>
                        </React.Fragment>
                      ))}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && <p className="text-sm italic text-muted">Reading the essays&hellip;</p>}
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div ref={bottomRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask what I think about something…"
          className="min-w-0 flex-1 rounded-md border border-rule bg-paper px-3.5 py-2 text-[15px] outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-md border border-accent px-4 py-2 text-[15px] text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-accent"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
