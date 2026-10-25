"use client";
import { useState } from "react";
import type { District, Item } from "@/lib/districts";

const tabs = [
  { id: "overview", label: "Обзор района" },
  { id: "food", label: "Пляжи и кафе" },
  { id: "night", label: "🔞 Ночная жизнь 21+" },
] as const;

function List({ items }: { items: Item[] }) {
  return (
    <ul className="dk-list">
      {items.map((i) => (
        <li key={i.t}>
          {i.u ? (
            <a href={i.u} target="_blank" rel="noopener noreferrer" className="dk-map">
              {i.t} 📍
            </a>
          ) : (
            i.t
          )}
        </li>
      ))}
    </ul>
  );
}

function Card({ title, items, cls = "" }: { title: string; items: Item[]; cls?: string }) {
  if (!items.length) return null;
  return (
    <article className={`dk-card ${cls}`}>
      <h3>{title}</h3>
      <List items={items} />
    </article>
  );
}

export function DistrictTabs({ d }: { d: District }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("overview");
  return (
    <div>
      <div className="dk-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <div className="dk-bento">
          <article className="dk-card"><h3>Атмосфера</h3><p>{d.atmosphere}</p></article>
          <article className="dk-card"><h3>Кому подойдёт</h3><p>{d.audience}</p></article>
          <Card title="Топ споты / знакомства" items={d.spots} cls="wide" />
        </div>
      )}
      {tab === "food" && (
        <div className="dk-bento">
          <Card title="Пляжи и природа" items={d.beaches} />
          <Card title="Общепит и кафе" items={d.food} />
          {!d.beaches.length && !d.food.length && (
            <article className="dk-card wide"><p>Раздел дополняется.</p></article>
          )}
        </div>
      )}
      {tab === "night" && (
        <div className="dk-bento">
          <Card title="🔞 Стрип / Go-Go" items={d.nightlife} cls="hot wide" />
          <Card title="Массаж и Spa" items={d.massage} />
          <Card title="Схемы скама" items={d.scams} />
          <Card title="Важно знать" items={d.notes} cls="wide" />
        </div>
      )}
    </div>
  );
}