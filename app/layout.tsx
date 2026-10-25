import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";

export const metadata: Metadata = {
  title: "MoveExploreGrow | Путеводитель по Таиланду и Пхукету 21+",
  description: "Честные обзоры районов Пхукета, ночная жизнь без скама, VIP-Гайд 21+ и консьерж-сервис.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <StickyCta />
      </body>
    </html>
  );
}