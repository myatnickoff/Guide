import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
export const metadata: Metadata = {
  title: "Вечер на Пхукете — личный гид 21+",
  description: "Выберите район, соберите план вечера и сохраните короткий чек-лист. Практичный гид по Пхукету для взрослых.",
  openGraph: { title: "Вечер на Пхукете · Гид 21+", description: "Планируйте вечер на Пхукете осознанно и безопасно.", type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}