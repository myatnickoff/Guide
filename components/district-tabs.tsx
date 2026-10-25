"use client";
import { useState } from "react";
import type { District } from "@/lib/districts";

const tabs = [
  { id: "overview", label: "Обзор района" },
  { id: "food", label: "Пляжи и кафе" },
  { id: "night", label: "🔞 Ночная жизнь 21+" },
] as const;

function List({ items }: { items: string[] }) {
  return <ul className="dk-list">{items.map((i) => <li key={i}>{i}</li>)}</ul>;
}

export function DistrictTabs({ d }: { d: District }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("overview");
  return (
    <div>
      <div className="dk-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab === "overview" && (
        <div className="dk-bento">
          <article className="dk-card"><h3>Атмосфера</h3><p>{d.atmosphere}</p></article>
          <article className="dk-card"><h3>Кому подойдёт</h3><p>{d.audience}</p></article>
          <article className="dk-card wide"><h3>Топ мест: закаты и смотровые</h3><List items={d.spots} /></article>
        </div>
      )}
      {tab === "food" && (
        <div className="dk-bento">
          <article className="dk-card"><h3>Пляжи и природа</h3><List items={d.beaches} /></article>
          <article className="dk-card"><h3>Общепит и кафе</h3><List items={d.food} /></article>
        </div>
      )}
      {tab === "night" && (
        <div className="dk-bento">
          <article className="dk-card hot wide"><h3>🔞 Сектор 21+</h3><List items={d.nightlife} /></article>
          <article className="dk-card"><h3>Схемы скама</h3><List items={d.scams} /></article>
          <article className="dk-card"><h3>Где знакомиться</h3><List items={d.meeting} /></article>
        </div>
      )}
    </div>
  );
}