import Link from "next/link";
import Image from "next/image";


const quotes = [
  {
    en: "What are the important problems of your field, and why aren't you working on them?",
    author: "Richard Hamming",
  },
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

export default function Home() {
  return (
    <main className="w-full px-6 pb-24 pt-10 md:px-12 lg:px-16">
      <h1 className="mb-4 border-b border-rule pb-4 text-3xl font-medium">
        Welcome
      </h1>

      <div className="mt-8 flex flex-col-reverse gap-8 md:flex-row md:items-start">
        <div className="flex-1 space-y-5 leading-relaxed">
          <p>
            My name is Jonathan Alexander Politzki. I grew up in the NW
            suburbs of Chicago. I studied finance with a minor in engineering
            at the University of Illinois, where I was first exposed to
            technology and I founded my first &ldquo;startups&rdquo; (
            <a
              href="https://www.quantillinois.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={a}
            >
              Quant
            </a>
            ,{" "}
            <a
              href="https://nephramed.wordpress.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={a}
            >
              Nephra
            </a>
            ). After university, I started my career in investment banking at
            Leerink Partners in NYC, then worked at Shaper Capital, and now
            work on AI, which I consider my main area of expertise. Many
            textbooks, projects, and products later, I have effectively become
            an engineer.
          </p>
          <p>
            I believe human focus is the most misallocated resource on earth,
            and that we can use AI to elevate ourselves and save people from
            repetitive and boring work. As machines commoditize existing
            knowledge, human creativity at the edges and working on important,
            unlikely problems is where I want to add the most value to the
            world. I call this{" "}
            <Link href="/writing/politzkis-law" className={a}>
              Politzki&apos;s Law
            </Link>{" "}
            (because we should all have a law, right?).
          </p>
          <p>
            I also believe the arrival of computers that understand humans will
            be the most important technology of my lifetime and perhaps my
            life&apos;s work. This is what we are building at{" "}
            <a
              href="https://jeanmemory.com"
              target="_blank"
              rel="noopener noreferrer"
              className={a}
            >
              Jean
            </a>
            .
          </p>
          <p>
            In this vein, my interests center on how computers understand and
            represent humans: representation learning, contrastive learning,
            AI memory,
            context engineering, embedding systems, user models, and emotion
            vectors. Most of them sprung out of my original essay,{" "}
            <Link href="/writing/general-personal-embeddings" className={a}>
              General Personal Embeddings
            </Link>
            .
          </p>
        </div>

        <div className="shrink-0 md:pt-1">
          <Image
            src="/profile.jpg"
            alt="Jonathan Politzki"
            width={224}
            height={224}
            priority
            className="mx-auto h-44 w-44 rounded-full border border-rule object-cover md:h-56 md:w-56"
          />
        </div>
      </div>

      <section className="mt-16 border-t border-rule pt-8">
        <h2 className="mb-5 text-sm font-medium uppercase tracking-wide text-muted">
          Guiding quotes
        </h2>
        <div className="space-y-5">
          {quotes.map((quote) => (
            <blockquote key={quote.en} className="text-sm text-muted">
              <p className="leading-relaxed">
                &ldquo;{quote.en}&rdquo;
                {quote.de && <span className="italic"> ({quote.de})</span>}
              </p>
              <footer className="mt-0.5 text-xs">
                {quote.author}
                {quote.source && (
                  <>
                    , <cite className="not-italic">{quote.source}</cite>
                  </>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

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
