import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAdminContext } from "@/lib/server/applications";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/adminportal")({
  head: () => ({
    meta: [
      { title: "秘書處後台 | HKATA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isPending } = useCurrentUserState();
  const [admin, setAdmin] = useState<"loading" | "yes" | "no">("loading");

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setAdmin("loading");
      return;
    }
    let cancelled = false;
    getAdminContext()
      .then((r) => {
        if (!cancelled) setAdmin(r.isAdmin ? "yes" : "no");
      })
      .catch(() => {
        if (!cancelled) setAdmin("no");
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, user]);

  if (isPending || (user && admin === "loading")) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <p className="text-sm text-subtle">載入中…</p>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (admin === "no") {
    return (
      <main className="grid min-h-screen place-items-center bg-bg px-6">
        <div className="max-w-md space-y-3 rounded-2xl border border-line bg-panel p-8 text-center">
          <h1 className="font-display text-xl font-semibold text-fg">未獲授權</h1>
          <p className="text-sm text-muted">
            此帳號不是秘書處管理員，無法查閱報名資料。如需權限，請聯絡大會秘書處。
          </p>
          <div className="flex justify-center pt-2">
            <UserButton />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-line-soft bg-bg/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              to="/adminportal"
              className="font-display text-sm font-semibold tracking-wide text-fg"
            >
              秘書處後台
            </Link>
            <Link to="/" className="text-sm text-subtle hover:text-fg">
              報名表
            </Link>
          </div>
          <UserButton />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
