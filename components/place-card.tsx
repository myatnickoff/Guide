import Link from "next/link";
import { CatIcon } from "@/components/icons";
import { getCategory, getDistrict, ui, type Place } from "@/lib/content";
import { mapsUrl } from "@/lib/config";
export function PlaceCard({ p, reason, position }: { p: Place; reason?: string | null; position?: number }) {
  const cat = getCategory(p.category);
  const d = getDistrict(p.district);
  return (
    <article className="pcard">
      <div className={`pcard-top cat-${p.category}`}>
        <CatIcon slug={p.category} size={28} />
        {position ? <span className="badge meg">{position}</span> : null}
        {p.is_editor_pick ? <span className="badge meg">{ui("card_meg_badge")}</span> : null}
      </div>
      <div className="pcard-body">
        <p className="caption">{[d?.name_ru, cat?.label_ru].filter(Boolean).join(" · ")}</p>
        <h3><Link href={`/place/${p.slug}`}>{p.name}</Link></h3>
        <p className="clamp">{reason || p.why_visit || p.short_description}</p>
        <div className="pcard-actions">
          {<a href={mapsUrl(p)} target="_blank" rel="noopener noreferrer" className="chip-link">{ui("card_btn_map")}</a>}
          <Link href={`/place/${p.slug}`} className="chip-link">{ui("card_expand")}</Link>
        </div>
      </div>
    </article>
  );
}
