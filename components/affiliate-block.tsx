import type { Placement } from "@/lib/content";
// Partner block: label is always visible; links carry rel="sponsored".
export function AffiliateBlock({ p }: { p: Placement }) {
  return (
    <aside className="aff" aria-label={p.label}>
      <span className="aff-label">{p.label}</span>
      <h3>{p.title}</h3>
      {p.body && <p>{p.body}</p>}
      <a className="btn" href={p.url} target="_blank" rel="sponsored noopener noreferrer" data-program={p.program}>{p.cta}</a>
      <p className="aff-disc">{p.disclosure}</p>
    </aside>
  );
}
