import { TELEGRAM_URL } from "@/lib/config";

export function StickyCta() {
  return (
    <a className="dk-sticky" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
      🔥 Открыть VIP-Гайд 21+ в Telegram
    </a>
  );
}