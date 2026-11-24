import Link from "next/link";
import { FeedbackForm } from "@/components/feedback-form";
import { SosBlock } from "@/components/sos-block";
import { CatIcon } from "@/components/icons";
import { gmaps } from "@/lib/config";
import { districts, placesIn, practical, routes, top5, ui, fmtDate } from "@/lib/content";

// v1 clinics kept from the original SOS block (MUST-KEEP F5); addresses still need verification.
const clinics = [
  { name: "PULSE Clinic Patong", addr: "127/2 Rat Uthit Road", url: gmaps("PULSE Clinic Patong") },
  { name: "PULSE Clinic Phuket Town", addr: "218/1 Phuket Road", url: gmaps("PULSE Clinic Phuket Town") },
];

export default function Home() {
  const ds = districts();
  const rs = routes().slice(0, 3);
  const pt = practical();
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">Пхукет · Таиланд · 16+</p>
          <h1 className="display">{ui("hero_title")}</h1>
          <p className="lead">{ui("hero_subtitle")}</p>
          <div className="actions">
            <a className="btn" href="#districts">{ui("cta_choose_district")}</a>
            <Link className="btn ghost" href="/top-5">{ui("cta_top5")}</Link>
          </div>
        </div>
      </section>
      {/* #vip anchor kept (MUST-KEEP); 21+ promo blocks are off until the 21+ stage */}
      <div id="vip" />

      <section className="wrap section" id="districts">
        <h2>Районы Пхукета</h2>
        {ds.length === 0 ? <p className="muted">Раздел скоро откроется.</p> : (
          <div className="grid3">
            <Link href="/top-5" className="dcard dcard-top5">
              <span className="caption">{ui("top5_label")}</span>
              <h3>Топ-5 по районам</h3>
              <p>{ui("top5_disclaimer")}</p>
            </Link>
            {ds.map((d) => (
              <Link href={`/phuket/${d.slug}`} className="dcard" key={d.slug}>
                <span className="caption">{d.name}</span>
                <h3>{d.name_ru}</h3>
                <p>{d.tagline}</p>
                <span className="small muted">{placesIn(d.slug).length} мест</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {top5().length > 0 && (
        <section className="wrap section">
          <h2>Топ-5 · MEG Selection</h2>
          <div className="hscroll">
            {top5().map((t) => (
              <Link key={t.title} href={`/phuket/${t.district}#top5`} className="chip"><CatIcon slug="attractions" size={16} /> {t.title}</Link>
            ))}
          </div>
        </section>
      )}

      {rs.length > 0 && (
        <section className="wrap section">
          <h2>Маршруты</h2>
          <div className="grid3">
            {rs.map((r) => (
              <Link key={r.slug} href={`/routes/${r.slug}`} className="rcard">
                <span className="caption">{ui("route_stops", { count: r.stops.length })}</span>
                <h3>{r.title}</h3>
                <p className="clamp">{r.summary}</p>
              </Link>
            ))}
          </div>
          <p><Link href="/routes">Все маршруты →</Link></p>
        </section>
      )}

      {pt.length > 0 && (
        <section className="wrap section">
          <h2>Практика: Таиланд и Пхукет</h2>
          <div className="grid3">
            {pt.map((t) => (
              <Link key={t.slug} href={`/practical/${t.slug}`} className="tile">
                <h3>{t.title}</h3>
                <p className="clamp small">{t.summary}</p>
                {t.verified_at && <span className="caption ok">{ui("practical_checked", { date: fmtDate(t.verified_at) })}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section">
        <h2>Карта Пхукета</h2>
        <p><a href={gmaps("Phuket Thailand")} target="_blank" rel="noopener noreferrer">Открыть Пхукет в Google Картах</a></p>
      </section>

      <section className="wrap section" id="sos">
        <h2>SOS и здоровье</h2>
        <SosBlock />
        <div className="grid3 mt">
          {clinics.map((c) => (
            <article className="card" key={c.name}>
              <h3>{c.name}</h3>
              <p className="small">{c.addr}. Тесты STI/HIV, PEP, PrEP. <span className="muted">Адрес требует проверки.</span></p>
              <p><a href={c.url} target="_blank" rel="noopener noreferrer">Открыть в Google Картах</a></p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section" id="feedback">
        <h2>{ui("form_feedback_title")}</h2>
        <FeedbackForm />
      </section>
    </main>
  );
}
