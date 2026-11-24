import Link from "next/link";
import { ui } from "@/lib/content";
// Always rendered (production too): numbers verified on stage 8 (PRD Thailand, UK FCDO).
export function SosBlock() {
  return (
    <div className="sos">
      <h3>{ui("sos_title")}</h3>
      <div className="sos-btns">
        <a href="tel:191" className="btn sos-btn">{ui("sos_call_police")}</a>
        <a href="tel:1669" className="btn sos-btn">{ui("sos_call_ambulance")}</a>
        <a href="tel:1155" className="btn sos-btn">{ui("sos_call_tourist_police")}</a>
        <a href="tel:199" className="btn sos-btn">Пожарные · 199</a>
      </div>
      <p className="small"><Link href="/practical/sos">Все экстренные номера и больницы →</Link></p>
    </div>
  );
}
