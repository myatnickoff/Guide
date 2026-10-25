import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { districts, getDistrict, unsplash } from "@/lib/districts";
import { DistrictTabs } from "@/components/district-tabs";
import { FeedbackForm } from "@/components/feedback-form";

export function generateStaticParams() {
  return districts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDistrict((await params).slug);
  return d ? { title: `${d.name} — гайд 21+ | MoveExploreGrow`, description: `${d.tagline}. ${d.atmosphere}` } : {};
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDistrict((await params).slug);
  if (!d) notFound();
  return (
    <main className="dk">
      <section className="dk-hero small">
        <Image src={unsplash(d.image)} alt={`Район ${d.name}`} fill sizes="100vw" unoptimized priority />
        <div className="dk-shade" />
        <div className="dk-wrap dk-hero-in">
          <Link href="/#districts" className="dk-back">← Все районы</Link>
          <h1>{d.name}</h1>
          <p>{d.tagline}</p>
        </div>
      </section>
      <section className="dk-wrap dk-section"><DistrictTabs d={d} /></section>
      <section className="dk-wrap dk-section">
        <div className="dk-cta" id="vip">
          <h2>✈️ Нужен персональный маршрут по району {d.name}?</h2>
          <p>Составим индивидуальный план под ваш бюджет. Напишите нашему консьержу.</p>
          <a className="dk-btn" href="#feedback">Заказать консьержа</a>
        </div>
      </section>
      <section className="dk-wrap dk-section" id="feedback"><h2 className="dk-h2">Связаться</h2><FeedbackForm /></section>
    </main>
  );
}