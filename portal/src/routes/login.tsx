import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "秘書處登入 | HKATA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Login,
});

function Login() {
  const { user, isPending } = useCurrentUserState();

  if (!isPending && user) return <Navigate to="/adminportal" />;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="grid flex-1 place-items-center px-6 pt-28 pb-16">
        <div className="w-full max-w-sm space-y-5 rounded-2xl border border-line bg-panel p-8">
          <p className="chip chip-gold">Secretariat</p>
          <h1 className="font-display text-2xl font-semibold text-fg">秘書處登入</h1>
          <p className="text-sm leading-relaxed text-muted">
            報名資料含學校及教師個人資料，僅限獲授權管理員查閱。請以大會帳號登入。
          </p>
          {isPending ? (
            <div className="h-11 w-full animate-pulse rounded-full bg-surface" />
          ) : authEnabled ? (
            <div className="flex flex-col gap-2">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => signIn(p.providerId, { callbackURL: "/adminportal" })}
                  className="btn btn-ghost w-full"
                >
                  以 {p.label} 登入
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-subtle">登入尚未啟用。</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
