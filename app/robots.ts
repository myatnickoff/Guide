import type { MetadataRoute } from "next";
import { SITE_URL, SHOW_UNPUBLISHED } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  if (SHOW_UNPUBLISHED || process.env.VERCEL_ENV === "preview") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
