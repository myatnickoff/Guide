import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Crumbs } from "@/components/breadcrumbs";
import { AffiliateBlock } from "@/components/affiliate-block";
import { getDistrict, getPlace, getRoute, placementsFor, routes, ui, fmtDate } from "@/lib/content";
import { mapsUrl } from "@/lib/config";
export const dynamicParams = false;
export function generateStaticParams() { return routes().map((r) => ({ slug: r.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = getRoute((await params).slug);
  return r ? { title: r.title, description: r.summary ?? undefined } : {};
}
export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRoute((await params).slug);
  if (!r) notFound();
  const d = r.district ? getDistrict(r.district) : undefined;
  const aff = placementsFor({ route: r.slug });
  return (
    <main className="wrap section narrow">
      <Crumbs items={[{ href: "/", label: "Пхукет" }, { href: "/routes", label: "Маршруты" }, { label: r.title }]} />
      <h1>{r.title}</h1>
      {r.summary && <p className="lead">{r.summary}</p>}
      <dl className="facts">
        {d && <><dt>Район</dt><dd><Link href={`/phuket/${d.slug}`}>{d.name_ru}</Link></dd></>}
        {r.best_time && <><dt>Когда</dt><dd>{r.best_time}</dd></>}
        {r.transport && <><dt>Как передвигаться</dt><dd>{r.transport}</dd></>}
      </dl>
      <h2>{ui("route_stops", { count: r.stops.length })}</h2>
      <ol className="stops">
        {r.stops.map((s) => { const p = s.place ? getPlace(s.place) : undefined; return (
          <li key={s.order}>
            <strong>{p ? <Link href={`/place/${p.slug}`}>{p.name}</Link> : s.label}</strong>
            {s.note && <p className="small">{s.note}</p>}
            {p && <a className="small" href={mapsUrl(p)} target="_blank" rel="noopener noreferrer">{ui("card_btn_map")}</a>}
          </li>); })}
      </ol>
      {r.last_verified && <p className="caption ok">{ui("card_verified_on", { date: fmtDate(r.last_verified) })}</p>}
      {aff.map((a) => <AffiliateBlock key={a.slot} p={a} />)}
    </main>
  );
}
