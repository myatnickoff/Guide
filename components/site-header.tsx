import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="dk-top">
      <Link className="dk-logo" href="/">Move<b>Explore</b>Grow</Link>
      <nav>
        <Link href="/#districts">Районы</Link>
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">VIP-Гайд 21+</a>
        <Link href="/#feedback">Консьерж</Link>
      </nav>
    </header>
  );
}