import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (name.length < 1 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || message.length < 10 || message.length > 3000) return NextResponse.json({ error: "Проверьте имя, почту и сообщение (10–3000 символов)." }, { status: 400 });
    const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return NextResponse.json({ error: "Форма ещё не подключена к базе данных. Напишите нам чуть позже." }, { status: 503 });
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await supabase.from("guide_feedback").insert({ name, email, message, source: "phuket-guide" });
    if (error) { console.error("Feedback insert failed:", error.message); return NextResponse.json({ error: "Не получилось сохранить сообщение. Попробуйте позже." }, { status: 500 }); }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 }); }
}