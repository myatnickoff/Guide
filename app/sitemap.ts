import type { MetadataRoute } from "next";
import { SITE_URL, districts, places, practical, routes } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => ({ url: `${SITE_URL}${p}` });
  return [u("/"), u("/phuket"), u("/top-5"), u("/routes"), u("/practical"), u("/practical/sos"),
    ...districts().map((d) => u(`/phuket/${d.slug}`)), ...places().map((p) => u(`/place/${p.slug}`)),
    ...routes().map((r) => u(`/routes/${r.slug}`)), ...practical().filter((t) => t.slug !== "sos").map((t) => u(`/practical/${t.slug}`))];
}
