import Image from "next/image";
import Link from "next/link";
import { districts, unsplash } from "@/lib/districts";
import { TELEGRAM_URL, VAPE_TEXT, gmaps } from "@/lib/config";
import { FeedbackForm } from "@/components/feedback-form";

const basics = [
  { icon: "🌦", title: "Погода и сезонность", text: "Высокий сезон: декабрь–май, на западном побережье можно купаться. Низкий: июнь–ноябрь — волны и обратное течение; всепогодные пляжи — восточное побережье (например, Панва)." },
  { icon: "💱", title: "Деньги и обмен", text: "Не меняйте деньги в аэропорту. Обменники (SuperRich), карты UnionPay, зарубежные карты, USDT. Подробности: [Уточнить актуальные данные]" },
  { icon: "📶", title: "Связь и интернет", text: "eSIM (Airalo / Dtac), мобильный интернет, навигация. Подробности: [Уточнить актуальные данные]" },
  { icon: "🚫", title: "Вейпы", text: VAPE_TEXT },
  { icon: "🌿", title: "Каннабис", text: "С июня 2025 цветки — только по медрецепту (PT33). Рекреационная покупка и употребление без рецепта незаконны; курение в общественных местах запрещено. Продукты с THC < 0,2% легальны." },
  { icon: "💨", title: "Кальяны", text: "[Уточнить актуальные данные]" },
];

const clinics = [
  { name: "PULSE Clinic Patong", addr: "127/2 Rat Uthit Road", url: gmaps("PULSE Clinic Patong") },
  { name: "PULSE Clinic Phuket Town", addr: "218/1 Phuket Road", url: gmaps("PULSE Clinic Phuket Town") },
];

export default function Home() {
  return (
    <main className="dk">
      <div className="dk-banner">
        🔥 VIP-Гайд 21+ и Консьерж-сервис —{" "}
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">подробнее в Telegram</a>
      </div>
      <section className="dk-hero">
        <Image src={unsplash("photo-1530789253388-582c481c54b0", 1800)} alt="Ночной Пхукет" fill sizes="100vw" unoptimized priority />
        <div className="dk-shade" />
        <div className="dk-wrap dk-hero-in">
          <p className="dk-eyebrow">21+ · THAILAND · PHUKET</p>
          <h1>MoveExploreGrow | Неприлизанный путеводитель по Таиланду и Пхукету 21+</h1>
          <p>Личный опыт 50+ стран. Секретные локации, честные обзоры районов, ночная жизнь без скама и персональный консьерж-сервис.</p>
          <div className="dk-actions">
            <a className="dk-btn" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">Получить VIP-Гайд 21+</a>
            <a className="dk-btn ghost" href="#districts">Выбрать район</a>
          </div>
        </div>
      </section>

      <section className="dk-wrap dk-section" id="vip">
        <div className="dk-cta">
          <h2>VIP-Гайд 21+</h2>
          <p>Устали от туристических разводов на Бангла-роуд и переплат? Получите доступ к закрытой интерактивной Google-карте 21+, андеграундным барам, кинки-ивентам и правилам безопасности.</p>
          <a className="dk-btn" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">Получить доступ</a>
        </div>
      </section>

      <section className="dk-wrap dk-section">
        <h2 className="dk-h2">Таиланд: практический хаб</h2>
        <div className="dk-bento">
          {basics.map((b) => (
            <article className="dk-card" key={b.title}><span className="dk-ico">{b.icon}</span><h3>{b.title}</h3><p>{b.text}</p></article>
          ))}
        </div>
      </section>

      <section className="dk-wrap dk-section">
        <h2 className="dk-h2">Карта Пхукета</h2>
        <article className="dk-card wide">
          <p><a className="dk-map" href={gmaps("Phuket Thailand")} target="_blank" rel="noopener noreferrer">Открыть Пхукет в Google Картах 📍</a></p>
        </article>
      </section>

      <section className="dk-wrap dk-section" id="districts">
        <h2 className="dk-h2">Районы Пхукета</h2>
        <div className="dk-grid">
          {districts.map((d) => (
            <Link href={`/phuket/${d.slug}`} className="dk-district" key={d.slug}>
              <Image src={unsplash(d.image, 900)} alt={d.name} fill sizes="(max-width:760px) 100vw, 33vw" unoptimized />
              <div className="dk-shade" />
              <div className="dk-district-in"><h3>{d.name}</h3><p>{d.tagline}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dk-wrap dk-section" id="sos">
        <h2 className="dk-h2">🆘 SOS / Здоровье</h2>
        <div className="dk-bento">
          {clinics.map((c) => (
            <article className="dk-card" key={c.name}>
              <h3>{c.name}</h3>
              <p>{c.addr}<br />STI/HIV тесты, PEP, PrEP</p>
              <p><a className="dk-map" href={c.url} target="_blank" rel="noopener noreferrer">Открыть в Google Картах 📍</a></p>
            </article>
          ))}
          <article className="dk-card hot">
            <h3>Экстренные номера</h3>
            <p><a href="tel:191">Полиция 191</a><br /><a href="tel:1669">Скорая 1669</a><br /><a href="tel:1155">Туристическая полиция 1155</a></p>
          </article>
        </div>
      </section>

      <section className="dk-wrap dk-section" id="feedback"><h2 className="dk-h2">Консьерж и обратная связь</h2><FeedbackForm /></section>
    </main>
  );
}