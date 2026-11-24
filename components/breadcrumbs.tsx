import Link from "next/link";
export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="crumbs">
      {items.map((it, i) => (
        <span key={i}>{it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}{i < items.length - 1 ? " / " : ""}</span>
      ))}
    </nav>
  );
}
