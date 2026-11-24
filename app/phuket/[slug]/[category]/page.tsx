import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PlaceCard } from "@/components/place-card";
import { Crumbs } from "@/components/breadcrumbs";
import { categories, districts, getCategory, getDistrict, getPlace, placeCats, places, placesIn, ui } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return districts().flatMap((d) => categories().filter((c) => placesIn(d.slug).some((p) => placeCats(p).includes(c.slug))).map((c) => ({ slug: d.slug, category: c.slug })));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }): Promise<Metadata> {
  const { slug, category } = await params;
  const d = getDistrict(slug), c = getCategory(category);
  return d && c ? { title: `${c.label_ru} — ${d.name_ru}` } : {};
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const d = getDistrict(slug), c = getCategory(category);
  if (!d || !c) notFound();
  const ps = placesIn(d.slug).filter((p) => placeCats(p).includes(c.slug));
  const nearby = places().filter((p) => d.neighbors.includes(p.district) && placeCats(p).includes(c.slug)).slice(0, 6);
  return (
    <main className="wrap section">
      <Crumbs items={[{ href: "/", label: "Пхукет" }, { href: `/phuket/${d.slug}`, label: d.name_ru }, { label: c.label_ru }]} />
      <h1>{c.label_ru}: {d.name_ru}</h1>
      {ps.length ? <div className="grid3">{ps.map((p) => <PlaceCard key={p.slug} p={p} />)}</div> : <><h2>{ui("category_empty_title")}</h2><p>{ui("category_empty_text")}</p></>}
      <h2 className="mt">{ui("nearby_title")}</h2>
      {nearby.length ? <div className="grid3">{nearby.map((p) => <PlaceCard key={p.slug} p={getPlace(p.slug)!} />)}</div> : <p className="muted">{ui("nearby_none_text")}</p>}
      <p className="mt"><Link href={`/phuket/${d.slug}`}>← {d.name_ru}</Link></p>
    </main>
  );
}
