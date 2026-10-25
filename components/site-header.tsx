import Link from "next/link";
export function SiteHeader() {
  return <header className="site-header"><Link className="brand" href="/" aria-label="На главную"><span className="brand-mark">P.</span><span>PHUKET <i>AFTER DARK</i></span></Link><nav className="desktop-nav" aria-label="Основная навигация"><a href="#choose">Районы</a><a href="#plans">Сценарии</a><a href="#safe">Безопасность</a><a href="#services">Помощь</a></nav><a className="header-cta" href="#plans">Собрать вечер <span>↗</span></a></header>;
}