import Link from "next/link";

const papers = [
  {
    title: "AI Memory: A Landscape Review",
    year: "2026",
    href: "https://www.jeanmemory.com/AI_Memory.pdf",
  },
  {
    title: "The State of AI Memory 2026",
    year: "2026",
    href: "https://www.jeanmemory.com/ai-memory-landscape-review.pdf",
  },
  {
    title:
      "On the Implicit Encoding of Human Psychology in Large Language Model Representations",
    year: "2026",
    href: "https://www.jeanmemory.com/GPE.pdf",
  },
  {
    title:
      "Local Drift-Adapters: Mixture-of-Expert Embedding Translation for Heterogeneous Vector Databases",
    year: "2026",
    href: "https://www.jeanmemory.com/Local_Drift_Adapters.pdf",
  },
];

const quotes = [
  {
    en: "He who has a why to live can bear almost any how.",
    de: "Hat man sein wofür des Lebens, so verträgt man sich fast mit jedem wie.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
  },
  {
    en: "He who strives and lives to strive, can earn redemption still.",
    de: "Wer immer strebend sich bemüht, den können wir erlösen.",
    author: "Johann Wolfgang von Goethe",
    source: "Faust, Part II",
  },
  {
    en: "Only he who is constantly changing is my kin.",
    de: "Nur wer sich wandelt, bleibt mit mir verwandt.",
    author: "Friedrich Nietzsche",
    source: "Posthumous Fragments",
  },
];

const links = [
  { label: "Email", href: "mailto:jonathan.politzki@gmail.com" },
  { label: "X", href: "https://x.com/ITNAmatter" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathan-politzki" },
  { label: "GitHub", href: "https://github.com/jonathan-politzki" },
  { label: "Substack", href: "https://jonathanpolitzki.substack.com" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-12">
      {/* Overview */}
      <section className="space-y-5 text-[1.05rem] font-light leading-relaxed">
        <p>
          My name is Jonathan Alexander Politzki. I am interested in ideas and
          innovation.
        </p>
        <p>
          I am guided by self-determination and I try to work on important,
          unlikely things. Human focus is the most misallocated resource on
          Earth — as machines get better at what is already known, human
          attention matters most at the edges, on high-complexity, low-data
          problems with no precedent to learn from. I call this{" "}
          <Link
            href="/writing/politzkis-law"
            className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
          >
            Politzki&apos;s Law
          </Link>
          .
        </p>
        <p>
          You can read more of what I think in{" "}
          <Link
            href="/writing"
            className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
          >
            my writing
          </Link>
          .
        </p>
      </section>

      {/* Work */}
      <section className="mt-16 border-t border-rule pt-10">
        <SectionLabel>Work</SectionLabel>
        <p className="mb-8 text-sm italic text-muted">
          &ldquo;Irreverence is a key to progress.&rdquo;{" "}
          <span className="font-mono text-xs not-italic">— Joel Mokyr</span>
        </p>
        <div className="space-y-6 font-light leading-relaxed">
          <p>
            <span className="font-medium">Irreverent Capital</span> builds
            important, unlikely technology businesses.
          </p>
          <p>
            Its first company is{" "}
            <a
              href="https://jeanmemory.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
            >
              Jean
            </a>
            , the universal matching engine. Jean builds a representation of
            who a person is from their context and interests, then matches them
            to whatever they&apos;re looking for — products, content, people,
            ideas.
          </p>
        </div>
      </section>

      {/* Interests */}
      <section className="mt-16 border-t border-rule pt-10">
        <SectionLabel>Interests</SectionLabel>
        <div className="space-y-6 font-light leading-relaxed">
          <p>
            AI models learn to understand the world by training on vast corpora
            of text. Since text is often a projection of our minds, these
            models have implicitly learned to understand us.
          </p>
          <p>
            Most of my interests sprung out of my original essay,{" "}
            <Link
              href="/writing/general-personal-embeddings"
              className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
            >
              General Personal Embeddings
            </Link>
            . I work on AI memory and context — systems that learn from what
            you do and say, so software can act on your behalf because it
            understands your history — and on latent representations:
            translating a human being into the high-dimensional map these
            models think in, and aligning different maps so they can talk to
            each other.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            Papers
          </h3>
          <ul className="space-y-2">
            {papers.map((paper) => (
              <li key={paper.title} className="flex items-baseline gap-3">
                <span className="shrink-0 font-mono text-xs text-muted">
                  {paper.year}
                </span>
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-light underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
                >
                  {paper.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quotes */}
      <section className="mt-16 border-t border-rule pt-10">
        <SectionLabel>Quotes</SectionLabel>
        <div className="space-y-10">
          {quotes.map((quote) => (
            <blockquote key={quote.author + quote.source}>
              <p className="font-light leading-relaxed">
                &ldquo;{quote.en}&rdquo;
              </p>
              <p className="mt-1 text-sm font-light italic text-muted">
                {quote.de}
              </p>
              <footer className="mt-2 font-mono text-xs text-muted">
                — {quote.author}, <cite className="not-italic">{quote.source}</cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Connect */}
      <footer className="mt-20 border-t border-rule pt-8">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
