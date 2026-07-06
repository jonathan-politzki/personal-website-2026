import Link from "next/link";
import Image from "next/image";


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

const connect = [
  { label: "jonathan.politzki@gmail.com", href: "mailto:jonathan.politzki@gmail.com" },
  { label: "X", href: "https://x.com/ITNAmatter" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathan-politzki" },
  { label: "GitHub", href: "https://github.com/jonathan-politzki" },
  { label: "Substack", href: "https://jonathanpolitzki.substack.com" },
];

const a =
  "text-accent transition-all hover:underline hover:underline-offset-4";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 mt-14 border-b border-rule pb-3 text-2xl font-medium">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <main className="w-full px-6 pb-24 pt-10 md:px-12 lg:px-16">
      <h1 className="mb-4 border-b border-rule pb-4 text-3xl font-medium">
        Welcome
      </h1>

      <div className="mt-8 flex flex-col-reverse gap-8 md:flex-row md:items-start">
        <div className="flex-1 space-y-5 leading-relaxed">
          <p>
            My name is Jonathan Alexander Politzki. I am interested in ideas
            and innovation.
          </p>
          <p>
            I am guided by self-determination and I try to work on important,
            unlikely things. As machines get better at what is already known,
            human attention matters most at the edges — on high-complexity,
            low-data problems with no precedent to learn from. I call this{" "}
            <Link href="/writing/politzkis-law" className={a}>
              Politzki&apos;s Law
            </Link>
            , and I try to spend my own focus accordingly.
          </p>
          <p>
            I run{" "}
            <span className="font-medium">Irreverent Capital</span>, which
            builds important, unlikely technology businesses. Its first company
            is{" "}
            <a
              href="https://jeanmemory.com"
              target="_blank"
              rel="noopener noreferrer"
              className={a}
            >
              Jean
            </a>
            , the universal matching engine: it builds a representation of who
            a person is from their context and interests, then matches them to
            whatever they&apos;re looking for — products, content, people,
            ideas.
          </p>
          <p>
            AI models learn to understand the world by training on vast
            corpora of text. Since text is often a projection of our minds,
            these models have implicitly learned to understand us. Most of my
            interests sprung out of my original essay,{" "}
            <Link href="/writing/general-personal-embeddings" className={a}>
              General Personal Embeddings
            </Link>
            .
          </p>
          <p>
            I use{" "}
            <Link href="/writing" className={a}>
              writing
            </Link>{" "}
            to map and compress my belief system.
          </p>
        </div>

        <div className="shrink-0 md:pt-1">
          <Image
            src="/portrait.jpg"
            alt="Jonathan Politzki"
            width={224}
            height={224}
            priority
            className="mx-auto h-44 w-44 rounded-full border border-rule object-cover md:h-56 md:w-56"
          />
        </div>
      </div>

      <SectionHeading>Quotes</SectionHeading>
      <div className="space-y-8">
        {quotes.map((quote) => (
          <blockquote
            key={quote.source}
            className="border-l-2 border-rule pl-5"
          >
            <p className="leading-relaxed">&ldquo;{quote.en}&rdquo;</p>
            <p className="mt-1 text-[15px] italic text-muted">{quote.de}</p>
            <footer className="mt-2 text-sm text-muted">
              — {quote.author},{" "}
              <cite className="not-italic">{quote.source}</cite>
            </footer>
          </blockquote>
        ))}
      </div>

      <footer className="mt-16 border-t border-rule pt-6">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px]">
          {connect.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={a}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
