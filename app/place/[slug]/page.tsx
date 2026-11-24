import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PlaceCard } from "@/components/place-card";
import { Crumbs } from "@/components/breadcrumbs";
import { allPlaces, fmtDate, getCategory, getDistrict, getPlace, placementsFor, places, ui } from "@/lib/content";
import { AffiliateBlock } from "@/components/affiliate-block";

export const dynamicParams = false;
export function generateStaticParams() {
  return allPlaces().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPlace((await params).slug);
  if (!p) return {};
  return { title: `${p.name} — ${getDistrict(p.district)?.name_ru ?? "Пхукет"}`, description: p.short_description ?? undefined, robots: p.status === "closed" ? { index: false } : undefined };
}
export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPlace((await params).slug);
  if (!p) notFound();
  const d = getDistrict(p.district), c = getCategory(p.category);
  const closed = p.status === "closed";
  const successor = p.replaced_by ? getPlace(p.replaced_by) : undefined;
  const alternatives = places().filter((x) => x.slug !== p.slug && x.category === p.category && (x.district === p.district || d?.neighbors.includes(x.district))).slice(0, 3);
  const aff = placementsFor({ place: p.slug });
  return (
    <main className="wrap section narrow">
      <Crumbs items={[{ href: "/", label: "Пхукет" }, ...(d ? [{ href: `/phuket/${d.slug}`, label: d.name_ru }] : []), ...(d && c ? [{ href: `/phuket/${d.slug}/${c.slug}`, label: c.label_ru }] : []), { label: p.name }]} />
      {closed && (
        <div className="banner warn" role="status">
          <strong>{ui("closed_banner_title")}</strong>
          <p>{ui("closed_banner_text", { date: fmtDate(p.last_verified) })} {p.closed_note}</p>
          {successor && <p>Теперь здесь: <Link href={`/place/${successor.slug}`}>{successor.name}</Link></p>}
        </div>
      )}
      <p className="caption">{[d?.name_ru, c?.label_ru].filter(Boolean).join(" · ")}</p>
      <h1>{p.name}</h1>
      {p.short_description && <p className="lead">{p.short_description}</p>}
      {p.why_visit && <p><strong>Зачем ехать:</strong> {p.why_visit}</p>}
      <dl className="facts">
        {p.address && <><dt>Адрес</dt><dd>{p.address}</dd></>}
        {p.opening_hours && <><dt>Часы</dt><dd>{p.opening_hours}</dd></>}
      </dl>
      <div className="actions">
        {p.google_maps_url && <a className="btn" href={p.google_maps_url} target="_blank" rel="noopener noreferrer">{ui("card_btn_map")}</a>}
        {p.official_url && <a className="btn ghost" href={p.official_url} target="_blank" rel="noopener noreferrer">{ui("card_btn_site")}</a>}
        {p.booking_url && <a className="btn ghost" href={p.booking_url} target="_blank" rel="noopener noreferrer">{ui("card_btn_book")}</a>}
      </div>
      {aff.map((a) => <AffiliateBlock key={a.slot} p={a} />)}
      <section className="mt">
        <h2 className="h3">{ui("place_sources_title")}</h2>
        {p.verification_status === "verified" && p.last_verified ? <p className="caption ok">{ui("card_verified_on", { date: fmtDate(p.last_verified) })}</p> : <p className="caption warn-t">Данные уточняются</p>}
        <ul className="small">{p.sources.map((s, i) => s.url && <li key={i}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title || new URL(s.url).hostname}</a></li>)}</ul>
        <p className="small"><Link href="/#feedback">{ui("place_report_error")}</Link></p>
      </section>
      {(closed || alternatives.length > 0) && (
        <section className="mt">
          <h2>{closed ? ui("closed_alternatives_title") : ui("nearby_title")}</h2>
          <div className="grid3">{alternatives.map((x) => <PlaceCard key={x.slug} p={x} />)}</div>
        </section>
      )}
    </main>
  );
}
