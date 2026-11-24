import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FeedbackForm } from "@/components/feedback-form";
import { PlaceCard } from "@/components/place-card";
import { AffiliateBlock } from "@/components/affiliate-block";
import { Crumbs } from "@/components/breadcrumbs";
import { CatIcon } from "@/components/icons";
import { categories, districts, getDistrict, getPlace, placeCats, placementsFor, placesIn, routes, top5For, ui } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return districts().map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDistrict((await params).slug);
  return d ? { title: `${d.name_ru} (${d.name}) — что посмотреть`, description: `${d.tagline}. ${d.intro}` } : {};
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDistrict((await params).slug);
  if (!d) notFound();
  const ps = placesIn(d.slug);
  const cats = categories().filter((c) => ps.some((p) => placeCats(p).includes(c.slug)));
  const t5 = top5For(d.slug);
  const rs = routes().filter((r) => r.district === d.slug);
  const neighbors = d.neighbors.map(getDistrict).filter(Boolean);
  const aff = placementsFor({ district: d.slug });
  return (
    <main>
      <section className="hero small">
        <div className="wrap">
          <Crumbs items={[{ href: "/", label: "Пхукет" }, { href: "/phuket", label: "Районы" }, { label: d.name_ru }]} />
          <p className="eyebrow">{d.name}</p>
          <h1>{d.name_ru}</h1>
          <p className="lead">{d.tagline}</p>
          <p>{d.intro}</p>
          <Link href="/#districts" className="small">← Все районы</Link>
        </div>
      </section>
      <nav className="chips wrap" aria-label="Категории района">
        {cats.map((c) => (
          <a key={c.slug} href={`#${c.slug}`} className="chip"><CatIcon slug={c.slug} size={16} /> {c.label_ru} <span className="caption">{ps.filter((p) => placeCats(p).includes(c.slug)).length}</span></a>
        ))}
      </nav>
      {t5 && (
        <section className="wrap section" id="top5">
          <p className="caption">{ui("top5_label")}</p>
          <h2>{t5.title}</h2>
          <p className="small muted">{ui("top5_disclaimer")}</p>
          <div className="grid3">
            {t5.items.map((it) => { const p = getPlace(it.place); return p ? <PlaceCard key={it.place} p={p} reason={it.reason} position={it.position} /> : null; })}
          </div>
          {t5.shortfall_note && <p className="small muted">{t5.shortfall_note}</p>}
        </section>
      )}
      {cats.map((c) => (
        <section className="wrap section" id={c.slug} key={c.slug}>
          <h2><CatIcon slug={c.slug} size={22} /> {c.label_ru}</h2>
          <div className="grid3">
            {ps.filter((p) => placeCats(p).includes(c.slug)).map((p) => <PlaceCard key={p.slug} p={p} />)}
          </div>
          <p className="small"><Link href={`/phuket/${d.slug}/${c.slug}`}>{ui("category_all", { count: ps.filter((p) => placeCats(p).includes(c.slug)).length })}</Link></p>
        </section>
      ))}
      {rs.length > 0 && (
        <section className="wrap section">
          <h2>Маршруты по району</h2>
          <div className="grid3">{rs.map((r) => <Link key={r.slug} href={`/routes/${r.slug}`} className="rcard"><span className="caption">{ui("route_stops", { count: r.stops.length })}</span><h3>{r.title}</h3><p className="clamp">{r.summary}</p></Link>)}</div>
        </section>
      )}
      {aff.length > 0 && <section className="wrap section">{aff.map((a) => <AffiliateBlock key={a.slot} p={a} />)}</section>}
      {neighbors.length > 0 && (
        <section className="wrap section">
          <h2>{ui("nearby_title")}</h2>
          <p className="small muted">{ui("nearby_subtitle", { districts: neighbors.map((n) => n!.name_ru).join(", ") })}</p>
          <div className="hscroll">{neighbors.map((n) => <Link key={n!.slug} className="chip" href={`/phuket/${n!.slug}`}>{n!.name_ru}</Link>)}</div>
        </section>
      )}
      <section className="wrap section" id="feedback"><h2>Связаться</h2><FeedbackForm /></section>
    </main>
  );
}
