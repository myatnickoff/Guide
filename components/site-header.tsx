import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="dk-top">
      <Link className="dk-logo" href="/">Move<b>Explore</b>Grow</Link>
      <nav>
        <Link href="/#districts">Районы</Link>
        <Link href="/#vip">VIP-Гайд 21+</Link>
        <Link href="/#feedback">Консьерж</Link>
      </nav>
    </header>
  );
}