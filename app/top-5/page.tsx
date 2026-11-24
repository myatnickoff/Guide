import type { Metadata } from "next";
import Link from "next/link";
import { Crumbs } from "@/components/breadcrumbs";
import { PlaceCard } from "@/components/place-card";
import { getDistrict, getPlace, top5, ui } from "@/lib/content";
export const metadata: Metadata = { title: "Топ-5 Пхукета по районам · MEG Selection" };
export default function Top5Page() {
  const sets = top5();
  return (
    <main className="wrap section">
      <Crumbs items={[{ href: "/", label: "Пхукет" }, { label: "Топ-5" }]} />
      <p className="caption">{ui("top5_label")}</p>
      <h1>Топ-5 по районам</h1>
      <p className="muted">{ui("top5_disclaimer")}</p>
      {sets.length === 0 && <p className="muted">Подборки скоро появятся.</p>}
      {sets.map((t) => (
        <section key={t.title} className="section">
          <h2><Link href={`/phuket/${t.district}`}>{t.district ? getDistrict(t.district)?.name_ru : t.title}</Link></h2>
          <div className="grid3">{t.items.map((it) => { const p = getPlace(it.place); return p ? <PlaceCard key={it.place} p={p} reason={it.reason} position={it.position} /> : null; })}</div>
        </section>
      ))}
    </main>
  );
}
