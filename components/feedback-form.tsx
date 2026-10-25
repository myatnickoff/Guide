"use client";
import { FormEvent, useState } from "react";
export function FeedbackForm() {
  const [status, setStatus] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries());
    try { const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Не удалось отправить сообщение"); form.reset(); setStatus("Спасибо! Сообщение отправлено."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Попробуйте ещё раз позже."); }
    finally { setBusy(false); }
  }
  return <form className="feedback-form" onSubmit={submit}><label>Как к вам обращаться?<input name="name" maxLength={100} placeholder="Имя" required /></label><label>Электронная почта<input name="email" type="email" maxLength={254} placeholder="you@example.com" required /></label><label>Сообщение<textarea name="message" minLength={10} maxLength={3000} placeholder="Поделитесь замечанием или задайте вопрос" required /></label><input className="trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><button className="button button-dark" disabled={busy}>{busy ? "Отправляем…" : "Отправить сообщение ↗"}</button>{status && <p className="form-status" role="status">{status}</p>}</form>;
}