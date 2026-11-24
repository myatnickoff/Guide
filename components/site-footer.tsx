import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/config";
import { ui } from "@/lib/content";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>{ui("footer_disclaimer")}</p>
        <p>Не садитесь за руль после алкоголя. Шлем на скутере обязателен по закону.</p>
        <p>{ui("footer_affiliate_disclosure")}</p>
        <p><Link href="/#feedback">Обратная связь</Link> · <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">Telegram-бот @MEGteam_bot</a></p>
      </div>
    </footer>
  );
}
