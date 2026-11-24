// Content layer (stage 9). Source: content/snapshot.json (exported from Supabase schema 4.7 seeds).
// Visibility: production shows only is_published rows; preview may show unpublished drafts
// when PREVIEW_SHOW_UNPUBLISHED=1 (set only for Preview env in Vercel).
import snapshot from "@/content/snapshot.json";

export type Source = { url: string | null; title?: string | null; type?: string | null; accessed_at?: string | null; is_official?: boolean; key?: string | null };
export type District = { slug: string; name: string; name_ru: string; tagline: string; intro: string; sort_order: number; is_published: boolean; neighbors: string[] };
export type Category = { slug: string; label_ru: string; icon: string | null; sort_order: number; is_published: boolean };
export type Place = {
  slug: string; name: string; district: string; category: string; categories: string[] | null;
  short_description: string | null; why_visit: string | null; address: string | null; google_maps_url: string | null;
  official_url: string | null; booking_url: string | null; price_level: number | null; opening_hours: string | null;
  age_rating: string; status: string; verification_status: string; closed_note: string | null; replaced_by: string | null;
  is_editor_pick: boolean; last_verified: string | null; is_published: boolean;
  photo: { url: string; credit: string | null; license: string | null; source_url: string | null; alt: string | null } | null;
  sources: Source[];
};
export type Route = { slug: string; title: string; district: string | null; theme: string | null; summary: string | null; duration_note: string | null; transport: string | null; best_time: string | null; budget_note: string | null; status: string; is_published: boolean; last_verified: string | null; sort_order: number; stops: { order: number; place: string | null; label: string | null; note: string | null }[] };
export type Top5 = { theme: string; district: string | null; title: string; subtitle: string | null; shortfall_note: string | null; is_published: boolean; items: { position: number; place: string; reason: string | null }[] };
export type PracticalItem = { text_ru: string; sources: string[]; verification: string; needs_check_note?: string };
export type Practical = { slug: string; title: string; summary: string | null; sections: { heading_ru: string; items: PracticalItem[] }[]; legal_flag: boolean; verification_status: string; verified_at: string | null; is_published: boolean; sort_order: number; sources: Source[] };
export type Placement = { slot: string; program: string; type: string; district: string | null; route: string | null; place: string | null; practical: string | null; category: string | null; title: string; body: string | null; cta: string; label: string; disclosure: string; url: string; sort_order: number };

type Snapshot = { meta: Record<string, unknown>; districts: District[]; categories: Category[]; places: Place[]; routes: Route[]; top5: Top5[]; practical: Practical[]; placements: Placement[]; ui: Record<string, unknown> };
const S = snapshot as unknown as Snapshot;

export const SHOW_UNPUBLISHED = process.env.PREVIEW_SHOW_UNPUBLISHED === "1" && process.env.VERCEL_ENV !== "production";
const visible = <T extends { is_published: boolean }>(rows: T[]) => rows.filter((r) => r.is_published || SHOW_UNPUBLISHED);

export const meta = S.meta;
// District shells are always routable: MUST-KEEP requires /phuket/<slug> to stay 200 even before content is published.
export const districts = () => [...S.districts].sort((a, b) => a.sort_order - b.sort_order);
export const getDistrict = (slug: string) => districts().find((d) => d.slug === slug);
export const categories = () => S.categories.filter((c) => c.is_published).sort((a, b) => a.sort_order - b.sort_order);
export const getCategory = (slug: string) => categories().find((c) => c.slug === slug);
// closed places stay reachable by URL (their page shows alternatives) but are excluded from lists
export const allPlaces = () => visible(S.places).filter((p) => p.age_rating !== "21+");
export const places = () => allPlaces().filter((p) => p.status !== "closed");
export const getPlace = (slug: string) => allPlaces().find((p) => p.slug === slug);
export const placesIn = (district: string) => places().filter((p) => p.district === district);
export const placeCats = (p: Place) => (p.categories && p.categories.length ? p.categories : [p.category]);
export const routes = () => visible(S.routes).filter((r) => r.status !== "closed").sort((a, b) => a.sort_order - b.sort_order);
export const getRoute = (slug: string) => routes().find((r) => r.slug === slug);
export const top5 = () => visible(S.top5);
export const top5For = (district: string) => top5().find((t) => t.district === district);
export const practical = () => visible(S.practical).sort((a, b) => a.sort_order - b.sort_order);
export const getPractical = (slug: string) => practical().find((t) => t.slug === slug);
// placement is shown only together with its (visible) page
export const placementsFor = (f: Partial<Pick<Placement, "district" | "route" | "practical" | "place">>) =>
  S.placements.filter((p) => Object.entries(f).every(([k, v]) => p[k as keyof Placement] === v)).sort((a, b) => a.sort_order - b.sort_order);

export function ui(key: string, vars: Record<string, string | number> = {}): string {
  let v = S.ui[key];
  if (Array.isArray(v)) v = v[0];
  let s = typeof v === "string" ? v : key;
  for (const [k, val] of Object.entries(vars)) s = s.replace(`{${k}}`, String(val));
  return s;
}
export const fmtDate = (d: string | null) => (d ? new Date(d + "T00:00:00Z").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "");
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://topguide-two.vercel.app";
