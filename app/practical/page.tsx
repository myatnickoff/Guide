import Link from "next/link";
import type { Metadata } from "next";
import { Crumbs } from "@/components/breadcrumbs";
import { SosBlock } from "@/components/sos-block";
import { practical, ui, fmtDate } from "@/lib/content";
export const metadata: Metadata = { title: "Практика: деньги, связь, транспорт, безопасность", description: "Практическая информация для поездки на Пхукет с источниками и датой проверки." };
export default function PracticalHub() {
  return (
    <main className="wrap section">
      <Crumbs items={[{ href: "/", label: "Пхукет" }, { label: "Практика" }]} />
      <h1>Практика</h1>
      <SosBlock />
      <div className="grid3 mt">
        {practical().map((t) => (
          <Link key={t.slug} href={`/practical/${t.slug}`} className="tile">
            <h3>{t.title}</h3><p className="small clamp">{t.summary}</p>
            {t.verified_at && <span className="caption ok">{ui("practical_checked", { date: fmtDate(t.verified_at) })}</span>}
          </Link>
        ))}
      </div>
    </main>
  );
}
