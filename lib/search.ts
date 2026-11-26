import type { Place } from "@/lib/content";

/** Plain-text haystack for client search (stage 10.7). No UI wiring in 10.3. */
export function searchText(p: Place): string {
  return [
    p.name,
    p.subcategory,
    p.short_description,
    p.why_visit,
    p.address,
    p.district,
    p.category,
    ...(p.categories ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

export function matchPlaces(query: string, list: Place[]): Place[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => searchText(p).toLowerCase().includes(q));
}
