import Link from "next/link";
import type { Metadata } from "next";
import { Crumbs } from "@/components/breadcrumbs";
import { getDistrict, routes, ui } from "@/lib/content";
export const metadata: Metadata = { title: "Маршруты по Пхукету", description: "Готовые маршруты по районам Пхукета на день." };
export default function RoutesPage() {
  const rs = routes();
  return (
    <main className="wrap section">
      <Crumbs items={[{ href: "/", label: "Пхукет" }, { label: "Маршруты" }]} />
      <h1>Маршруты</h1>
      {rs.length === 0 ? <p className="muted">Маршруты скоро появятся.</p> : (
        <div className="grid3">{rs.map((r) => (
          <Link key={r.slug} href={`/routes/${r.slug}`} className="rcard">
            <span className="caption">{[r.district ? getDistrict(r.district)?.name_ru : "Весь остров", ui("route_stops", { count: r.stops.length })].join(" · ")}</span>
            <h3>{r.title}</h3><p className="clamp">{r.summary}</p>
          </Link>))}
        </div>
      )}
    </main>
  );
}
