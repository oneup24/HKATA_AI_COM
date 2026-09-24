import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SITE_ORIGIN } from "@/lib/catalog";

const NAV = [
  { href: `${SITE_ORIGIN}/`, label: "比賽概覽", external: true },
  { href: `${SITE_ORIGIN}/index.html#schedule`, label: "賽事日程", external: true },
  { href: `${SITE_ORIGIN}/kindergarten.html`, label: "幼兒組", external: true, tone: "text-group-k" },
  { href: `${SITE_ORIGIN}/primary.html`, label: "小學組", external: true, tone: "text-group-p" },
  { href: `${SITE_ORIGIN}/secondary.html`, label: "中學組", external: true, tone: "text-group-s" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 z-40 w-full border-b border-line-soft bg-bg">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
        <Link to="/" className="flex flex-col justify-center" aria-label="報名首頁">
          <span className="text-[10px] leading-none tracking-[0.18em] text-fg sm:text-xs">
            全港首屆中小學「航天築夢」
          </span>
          <span className="text-[10px] leading-none tracking-[0.18em] text-fg sm:text-xs">
            航天 AI 創新大賽
          </span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="主選單">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className={`nav-link ${item.tone ?? ""}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="p-2 text-fg lg:hidden"
          aria-label={open ? "關閉選單" : "開啟選單"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <nav
          className="mx-auto flex max-w-[1400px] flex-col gap-3 border-t border-line-soft px-6 py-4 lg:hidden"
          aria-label="行動版選單"
        >
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className="nav-link py-1">
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line-soft pt-12 pb-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 text-center md:flex-row md:text-left">
        <div>
          <div className="mb-1 font-display text-base font-bold tracking-[0.18em] text-fg">
            全港首屆中小學「航天築夢」
          </div>
          <div className="mt-1 text-[10px] tracking-[0.18em] text-subtle">航天 AI 創新大賽</div>
        </div>
        <nav className="flex flex-wrap justify-center gap-5 text-xs text-muted">
          <a href={SITE_ORIGIN} className="hover:text-fg">
            首頁
          </a>
          <a href={`${SITE_ORIGIN}/kindergarten.html`} className="hover:text-fg">
            幼兒章程
          </a>
          <a href={`${SITE_ORIGIN}/primary.html`} className="hover:text-fg">
            小學章程
          </a>
          <a href={`${SITE_ORIGIN}/secondary.html`} className="hover:text-fg">
            中學章程
          </a>
          <a href="mailto:support@hkata.space" className="hover:text-fg">
            聯絡秘書處
          </a>
        </nav>
        <div className="text-xs text-subtle">
          © 2026 HKATA.
          <br />
          <a href="mailto:support@hkata.space" className="text-accent-3 hover:text-fg">
            support@hkata.space
          </a>
          · 6112 2270
        </div>
      </div>
    </footer>
  );
}
