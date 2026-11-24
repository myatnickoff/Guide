import Link from "next/link";
// Mobile sticky button (≤800px) — mechanics kept from v1; target is now SOS/practical for 16+.
export function StickyCta() {
  return <Link className="dk-sticky" href="/practical/sos">SOS · экстренные номера</Link>;
}
