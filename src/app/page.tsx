import Link from "next/link";

// Quotes stay in their original language where the original is not English;
// the author alone is credited, inline at the end of the line.
const quotes = [
  {
    text: "What are the important problems of your field, and why aren't you working on them?",
    author: "Richard Hamming",
  },
  {
    text: "Hat man sein wofür des Lebens, so verträgt man sich fast mit jedem wie.",
    author: "Friedrich Nietzsche",
  },
  {
    text: "Wer immer strebend sich bemüht, den können wir erlösen.",
    author: "Johann Wolfgang von Goethe",
  },
  {
    text: "Nur wer sich wandelt, bleibt mit mir verwandt.",
    author: "Friedrich Nietzsche",
  },
];

const connect = [
  { label: "Email", href: "mailto:jonathan.politzki@gmail.com" },
  { label: "X", href: "https://x.com/ITNAmatter" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathanpolitzki/" },
  { label: "GitHub", href: "https://github.com/jonathan-politzki" },
];

export default function Home() {
  return (
    <main>
      <h1>Jonathan Politzki</h1>

      <p>
        My name is Jonathan Alexander Politzki. I grew up in Cary, IL. I studied at the
        University of Illinois, where I was first introduced to technology startups (
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
        ). My first job was in biotechnology investment banking at Leerink Partners in NYC. Then, I worked at Shaper Capital.
      </p>
      <p>
        Computers have proven a remarkable ability to understand the world and us. I am very interested in{" "}
        <a
          href="https://www.jeantechnologies.com/editorial/posts/teaching-machines-to-understand-humans"
          target="_blank"
          rel="noopener noreferrer"
        >
          how we can teach computers to understand humans
        </a>{" "}
        and what the implications of that technology will be. I started{" "}
        <a
          href="https://jeanmemory.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jean
        </a>{" "}
        to build this technology. Most of this work was inspired by my essay,{" "}
        <Link href="/writing/general-personal-embeddings">
          General Personal Embeddings
        </Link>
        .
      </p>

      <h2>Good quotes</h2>
      <ul className="quotes">
        {quotes.map((quote) => (
          <li key={quote.text}>
            &ldquo;{quote.text}&rdquo;{" "}
            <span className="attribution">&mdash; {quote.author}</span>
          </li>
        ))}
      </ul>

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
