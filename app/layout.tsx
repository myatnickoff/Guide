import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { SITE_URL, SHOW_UNPUBLISHED, meta } from "@/lib/content";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--f-body", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["600", "700"], variable: "--f-head", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "MoveExploreGrow | Путеводитель по Пхукету 16+", template: "%s | MoveExploreGrow" },
  description: "Районы Пхукета, проверенные места, топ-5, маршруты и практическая информация: деньги, связь, транспорт, безопасность.",
  robots: SHOW_UNPUBLISHED ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body data-source="snapshot" data-snapshot={String(meta.generated_at)} data-preview={SHOW_UNPUBLISHED ? "1" : undefined}>
        {SHOW_UNPUBLISHED && <div className="preview-bar">Предпросмотр: показаны неопубликованные материалы</div>}
        <SiteHeader />
        {children}
        <SiteFooter />
        <StickyCta />
      </body>
    </html>
  );
}
