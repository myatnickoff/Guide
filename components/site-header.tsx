"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
const NAV = [
  { href: "/phuket", label: "Районы" },
  { href: "/top-5", label: "Топ-5" },
  { href: "/routes", label: "Маршруты" },
  { href: "/practical", label: "Практика" },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>Move<b>Explore</b>Grow</Link>
        <nav className="hdr-nav" aria-label="Основное меню">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <Link href="/practical/sos" className="pill-sos">SOS</Link>
        </nav>
        <button className="burger" aria-expanded={open} aria-controls="menu" aria-label={open ? "Закрыть меню" : "Открыть меню"} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav id="menu" className="menu" aria-label="Мобильное меню">
          {NAV.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>)}
          <Link href="/practical/sos" className="pill-sos big" onClick={() => setOpen(false)}>SOS · экстренные номера</Link>
        </nav>
      )}
    </header>
  );
}
