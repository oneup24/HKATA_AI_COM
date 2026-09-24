import { createFileRoute } from "@tanstack/react-router";
import { ApplyForm } from "@/components/apply-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { LEVELS, type Level } from "@/lib/catalog";

type Search = { level?: Level };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const level = typeof s.level === "string" && LEVELS.includes(s.level as Level)
      ? (s.level as Level)
      : undefined;
    return { level };
  },
  component: Home,
});

function Home() {
  const { level } = Route.useSearch();
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-36 pb-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="chip chip-gold mb-3 inline-block">Official School Registration</span>
          <h1 className="font-serif text-3xl leading-tight font-black text-fg sm:text-5xl">
            參賽學校代表
            <br />
            報名系統
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            提交後秘書處將於 11月下旬官宣抽籤分組結果及通知校方領取官方「官方硬件套件」。
          </p>
          <p className="mt-2 text-sm text-subtle">
            截止日期：
            <strong className="text-fg">2026 年 10 月 31 日 23:59</strong> (香港時間)
          </p>
        </div>
        <ApplyForm levelFromUrl={level} />
      </main>
      <SiteFooter />
    </div>
  );
}
