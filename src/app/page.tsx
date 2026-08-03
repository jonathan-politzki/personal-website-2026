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
  { label: "Email", href: "mailto:jonathan.politzki@gmail.com" },
  { label: "X", href: "https://x.com/ITNAmatter" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathanpolitzki/" },
  { label: "GitHub", href: "https://github.com/jonathan-politzki" },
  { label: "Substack", href: "https://jonathanpolitzki.substack.com" },
];

export default function Home() {
  return (
    <main>
      <h1>Welcome</h1>

      <Image
        src="/profile.jpg"
        alt="Jonathan Politzki"
        width={140}
        height={140}
        priority
        style={{
          float: "right",
          margin: "0.4em 0 1em 1.2em",
          width: 140,
          height: 140,
          objectFit: "cover",
        }}
      />

      <p>
        My name is Jonathan Alexander Politzki. I grew up in the NW suburbs of
        Chicago. I studied finance with a minor in engineering at the
        University of Illinois, where I fell in love with technology and I
        founded my first &ldquo;startups&rdquo; (
        <a
          href="https://www.quantillinois.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Quant
        </a>
        ,{" "}
        <a
          href="https://nephramed.wordpress.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nephra
        </a>
        ). After university, I started my career in investment banking at
        Leerink Partners in NYC, then worked at Shaper Capital, and now work on
        AI, which I consider my main area of expertise. Many textbooks,
        projects, and products later, I consider myself more of an engineer
        than anything else.
      </p>
      <p>
        I believe human focus is the most misallocated resource on earth, and
        that we can use AI to elevate ourselves and save people from repetitive
        and boring work. Most of this technology is already here but it is just
        not evenly distributed yet. One vector of progress I am focused on is
        simply helping companies absorb this technology.
      </p>
      <p>
        I also believe the arrival of computers that understand humans will be
        the most important technology of my lifetime and perhaps my
        life&apos;s work. This is what we are building at{" "}
        <a
          href="https://jeanmemory.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jean
        </a>
        . In this vein, my interests center on how computers understand and
        represent humans: representation learning, contrastive learning, AI
        memory, context engineering, embedding systems, user models, and
        emotion vectors. Most of them sprung out of my original essay,{" "}
        <Link href="/writing/general-personal-embeddings">
          General Personal Embeddings
        </Link>
        .
      </p>

      <h2>Guiding quotes</h2>
      {quotes.map((quote) => (
        <blockquote key={quote.en}>
          <p>
            &ldquo;{quote.en}&rdquo;
            {quote.de && <span> ({quote.de})</span>}
          </p>
          <p className="note">
            &mdash; {quote.author}
            {quote.source && (
              <>
                , <cite>{quote.source}</cite>
              </>
            )}
          </p>
        </blockquote>
      ))}

      <p className="thanks">
        {connect.map((link, i) => (
          <span key={link.label}>
            {i > 0 && " · "}
            <a
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          </span>
        ))}
      </p>
    </main>
  );
}
