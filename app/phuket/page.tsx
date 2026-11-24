import Link from "next/link";
import type { Metadata } from "next";
import { districts, placesIn } from "@/lib/content";
import { Crumbs } from "@/components/breadcrumbs";
export const metadata: Metadata = { title: "Районы Пхукета", description: "8 районов Пхукета: что где посмотреть, топ-5 и проверенные места." };
export default function DistrictsHub() {
  return (
    <main className="wrap section">
      <Crumbs items={[{ href: "/", label: "Пхукет" }, { label: "Районы" }]} />
      <h1>Районы Пхукета</h1>
      <div className="grid3">
        {districts().map((d) => (
          <Link href={`/phuket/${d.slug}`} className="dcard" key={d.slug}>
            <span className="caption">{d.name}</span><h3>{d.name_ru}</h3><p>{d.tagline}</p>
            <span className="small muted">{placesIn(d.slug).length} мест</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
