import Link from "next/link";

// The site links to no writing index; the only essay link lives in the home-page bio.
const items = [{ label: "Home", href: "/" }];

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
