export const TELEGRAM_URL = "https://t.me/MEGteam_bot";

export const VAPE_TEXT =
  "Официально вейпы запрещены законом Таиланда. На практике их свободно продают в туристических зонах, но курение на глазах у полиции влечет неофициальные штрафы на месте (от 5,000 до 25,000 THB). Держите устройства в кармане при полицейских патрулях.";

export const gmaps = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${query.trim().replace(/\s+/g, "+")}`;

/** Schema 4.8: coordinates first, else a stored Maps URL, else name + address. */
export type MapsTarget = {
  name: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  google_maps_url?: string | null;
};

export function mapsUrl(p: MapsTarget): string {
  if (p.lat != null && p.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  }
  if (p.google_maps_url) return p.google_maps_url;
  return gmaps([p.name, p.address].filter(Boolean).join(" "));
}
