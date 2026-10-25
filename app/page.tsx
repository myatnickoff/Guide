import Image from "next/image";
import Link from "next/link";
import { districts, unsplash } from "@/lib/districts";
import { FeedbackForm } from "@/components/feedback-form";

const TBD = "[Уточнить актуальные данные]";
const basics = [
  { icon: "🌦", title: "Погода и сезонность", text: "Высокий сезон: декабрь–май, на западном побережье можно купаться. Низкий: июнь–ноябрь — волны и обратное течение; всепогодные пляжи — восточное побережье (например, Панва)." },
  { icon: "💱", title: "Деньги и обмен", text: `Не меняйте деньги в аэропорту. Обменники (SuperRich), карты UnionPay, зарубежные карты, USDT: ${TBD}` },
  { icon: "📶", title: "Связь и интернет", text: `eSIM (Airalo / Dtac), мобильный интернет, навигация: ${TBD}` },
  { icon: "🚫", title: "Вейпы", text: "Ввоз и использование электронных сигарет и вейпов запрещены, штрафы реальные: от 5 000 до 25 000 бат по опыту туристов. Инструкция по безопасности: [Уточнить актуальные данные]" },
  { icon: "🌿", title: "Каннабис", text: "С июня 2025 цветки — только по медрецепту. Рекреационная покупка и употребление без рецепта незаконны; курение в общественных местах запрещено. Продукты с THC < 0,2% легальны." },
  { icon: "💨", title: "Кальяны", text: `Официальный статус и бары, где подают: ${TBD}` },
];

export default function Home() {
  return (
    <main className="dk">
      <div className="dk-banner">🔥 VIP-Гайд 21+ и Консьерж-сервис — <a href="#vip">подробнее</a></div>
      <section className="dk-hero">
        <Image src={unsplash("photo-1530789253388-582c481c54b0", 1800)} alt="Ночной Пхукет" fill sizes="100vw" unoptimized priority />
        <div className="dk-shade" />
        <div className="dk-wrap dk-hero-in">
          <p className="dk-eyebrow">21+ · THAILAND · PHUKET</p>
          <h1>MoveExploreGrow | Неприлизанный путеводитель по Таиланду и Пхукету 21+</h1>
          <p>Личный опыт 50+ стран. Секретные локации, честные обзоры районов, ночная жизнь без скама и персональный консьерж-сервис.</p>
          <div className="dk-actions"><a className="dk-btn" href="#vip">Получить VIP-Гайд 21+</a><a className="dk-btn ghost" href="#districts">Выбрать район</a></div>
        </div>
      </section>

      <section className="dk-wrap dk-section" id="vip">
        <div className="dk-cta">
          <h2>VIP-Гайд 21+</h2>
          <p>Устали от туристических разводов на Бангла-роуд и переплат? Получите доступ к закрытой интерактивной Google-карте 21+, андеграундным барам, кинки-ивентам и правилам безопасности.</p>
          <a className="dk-btn" href="#feedback">Получить доступ</a>
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
        <article className="dk-card wide"><p>Общая карта Пхукета и вводная часть: {TBD}</p></article>
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

      <section className="dk-wrap dk-section" id="feedback"><h2 className="dk-h2">Консьерж и обратная связь</h2><FeedbackForm /></section>
    </main>
  );
}