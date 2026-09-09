import Link from "next/link";

// Writing points at Substack — the site keeps no public index of its own.
const items = [
  { label: "Home", href: "/" },
  { label: "Writing", href: "https://jonathanpolitzki.substack.com", external: true },
];

export default function Menu() {
  return (
    <div id="menu">
      <span className="title">Jonathan Politzki</span>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            {item.external ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
