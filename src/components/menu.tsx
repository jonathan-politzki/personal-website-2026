import Link from "next/link";

const items = [
  { label: "Home", href: "/" },
  { label: "Writing", href: "/writing" },
];

export default function Menu() {
  return (
    <div id="menu">
      <span className="title">Jonathan Politzki</span>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
