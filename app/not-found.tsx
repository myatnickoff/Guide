import Link from "next/link";
import { districts, ui } from "@/lib/content";
export default function NotFound() {
  return (
    <main className="wrap section narrow">
      <h1>{ui("notfound_title")}</h1>
      <p>{ui("notfound_text")}</p>
      <p><Link className="btn" href="/">На главную</Link></p>
      <div className="hscroll mt">{districts().map((d) => <Link key={d.slug} className="chip" href={`/phuket/${d.slug}`}>{d.name_ru}</Link>)}</div>
    </main>
  );
}
