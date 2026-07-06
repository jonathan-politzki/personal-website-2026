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

export default function Home() {
  return (
    <main className="w-full px-6 pb-24 pt-10 md:px-12 lg:px-16">
      <h1 className="mb-4 border-b border-rule pb-4 text-3xl font-medium">
        Welcome
      </h1>

      <div className="mt-8 flex flex-col-reverse gap-8 md:flex-row md:items-start">
        <div className="flex-1 space-y-5 leading-relaxed">
          <p>
            My name is Jonathan Alexander Politzki. I studied finance with a
            minor in engineering at the University of Illinois, where I founded
            my first startups. Over time I effectively became an engineer after
            realizing it is the most important skill in building technology
            businesses. Since university I have been building in or around AI,
            and I consider it my main area of expertise. I am interested in
            innovation and in building technology companies where the
            bottlenecks to progress are difficult technical problems.
          </p>
          <p>
            I believe human focus is the most misallocated resource on earth,
            and that we can use AI to elevate ourselves and save people from
            repetitive and boring work. As machines get better at what is
            already known, human attention matters most on high-complexity,
            low-data problems with no precedent to learn from. I call this{" "}
            <Link href="/writing/politzkis-law" className={a}>
              Politzki&apos;s Law
            </Link>
            , and I try to spend my own focus accordingly.
          </p>
          <p>
            I also believe the arrival of computers that understand humans will
            be the most important technology of my lifetime. This is what we
            are building at{" "}
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
            My interests center on how computers understand and represent
            humans: representation learning, contrastive learning, AI memory,
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
            <blockquote key={quote.source} className="text-sm text-muted">
              <p className="leading-relaxed">
                &ldquo;{quote.en}&rdquo;{" "}
                <span className="italic">({quote.de})</span>
              </p>
              <footer className="mt-0.5 text-xs">
                {quote.author}, <cite className="not-italic">{quote.source}</cite>
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
