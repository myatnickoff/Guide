import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Crumbs } from "@/components/breadcrumbs";
import { AffiliateBlock } from "@/components/affiliate-block";
import { SosBlock } from "@/components/sos-block";
import { PlaceCard } from "@/components/place-card";
import { getPlace, getPractical, placementsFor, practical, ui, fmtDate } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  const s = practical().map((t) => ({ slug: t.slug }));
  return s.some((x) => x.slug === "sos") ? s : [...s, { slug: "sos" }]; // /practical/sos always exists (static fallback)
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getPractical((await params).slug);
  return t ? { title: t.title, description: t.summary ?? undefined } : { title: "Экстренные номера" };
}
export default async function PracticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const t = getPractical(slug);
  if (!t && slug !== "sos") notFound();
  const aff = placementsFor({ practical: slug });
  const srcByKey = new Map((t?.sources ?? []).map((s) => [s.key, s]));
  const num = new Map<string, number>();
  (t?.sources ?? []).forEach((s, i) => num.set(String(s.key), i + 1));
  return (
    <main className="wrap section narrow">
      <Crumbs items={[{ href: "/", label: "Пхукет" }, { href: "/practical", label: "Практика" }, { label: t?.title ?? "Экстренные номера" }]} />
      <h1>{t?.title ?? "Экстренные номера"}</h1>
      {t?.summary && <p className="lead">{t.summary}</p>}
      {slug === "sos" && <SosBlock />}
      {t?.sections.map((s) => (
        <section key={s.heading_ru} className="mt">
          <h2 className="h3">{s.heading_ru}</h2>
          <ul className="plist">
            {s.items.map((it, i) => (
              <li key={i}>
                {it.text_ru}{" "}
                {it.sources.map((k) => srcByKey.get(k)).filter(Boolean).map((src) => <sup key={String(src!.key)}><a href={`#src-${src!.key}`}>[{num.get(String(src!.key))}]</a></sup>)}
                {it.verification === "owner_confirmed" && <span className="caption muted"> · по данным редакции</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {slug === "sos" && (
        <section className="mt">
          <h2 className="h3">Больницы в гиде</h2>
          <div className="grid3">{["bangkok-hospital-phuket", "patong-hospital"].map((s) => getPlace(s)).filter(Boolean).map((p) => <PlaceCard key={p!.slug} p={p!} />)}</div>
        </section>
      )}
      {aff.map((a) => <AffiliateBlock key={a.slot} p={a} />)}
      {t && (
        <section className="mt">
          <h2 className="h3">Источники</h2>
          {t.verified_at && <p className="caption ok">{ui("practical_checked", { date: fmtDate(t.verified_at) })}</p>}
          <ol className="small">
            {t.sources.map((s) => (
              <li key={String(s.key)} id={`src-${s.key}`}>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> : s.title}{s.is_official ? " (официальный)" : ""}</li>
            ))}
          </ol>
        </section>
      )}
      <p className="mt"><Link href="/practical">← Вся практика</Link></p>
    </main>
  );
}
