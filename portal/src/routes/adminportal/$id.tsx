import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  BRIEFING_META,
  CATEGORY_LABEL,
  DISTRICT_LABEL,
  KIT_LABEL,
  LEVEL_LABEL,
  STATUSES,
  STATUS_LABEL,
  TITLE_LABEL,
  TRACK_META,
  type BriefingSession,
  type District,
  type KitId,
  type SchoolCategory,
  type Status,
  type TeacherTitle,
} from "@/lib/catalog";
import {
  getApplication,
  saveAdminNote,
  updateApplicationStatus,
  type ApplicationDetail,
  type ApplicationEvent,
} from "@/lib/server/applications";
import { StatusBadge } from "@/components/status-badge";
import { formatHk } from "@/lib/datetime";

export const Route = createFileRoute("/adminportal/$id")({
  component: AdminDetail,
});

function AdminDetail() {
  const { id } = Route.useParams();
  const numId = Number(id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [status, setStatus] = useState<Status>("submitted");
  const [statusNote, setStatusNote] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  function load() {
    setLoading(true);
    setError("");
    getApplication({ data: { id: numId } })
      .then((r) => {
        if (!r) {
          setError("找不到此報名");
          setApp(null);
          return;
        }
        setApp(r.application);
        setEvents(r.events);
        setStatus(r.application.status);
        setAdminNote(r.application.adminNote);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        setError(msg === "Unauthorized" ? "請先登入" : msg === "Forbidden" ? "未獲授權" : "無法載入");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!Number.isInteger(numId) || numId <= 0) {
      setError("無效編號");
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numId]);

  async function onStatus(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved("");
    try {
      await updateApplicationStatus({ data: { id: numId, status, note: statusNote } });
      setStatusNote("");
      setSaved("狀態已更新");
      load();
    } catch {
      setError("無法更新狀態");
    } finally {
      setSaving(false);
    }
  }

  async function onNote(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved("");
    try {
      await saveAdminNote({ data: { id: numId, note: adminNote } });
      setSaved("備註已儲存");
      load();
    } catch {
      setError("無法儲存備註");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-40 animate-pulse rounded-2xl bg-panel" />
      </main>
    );
  }
  if (!app) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-danger">{error || "找不到此報名"}</p>
        <Link to="/adminportal" className="mt-4 inline-flex text-sm text-accent-3 hover:text-fg">
          返回列表
        </Link>
      </main>
    );
  }

  const kit = app.kitPriority;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        to="/adminportal"
        className="mb-6 inline-flex items-center gap-2 text-sm text-subtle hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        返回列表
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm tracking-wide text-gold-soft">{app.applicationId}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg">{app.schoolNameCn}</h1>
          <p className="text-sm text-subtle">{app.schoolNameEn}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {error ? (
        <p className="mb-4 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? <p className="mb-4 text-sm text-ok">{saved}</p> : null}

      <section className="mb-6 space-y-4 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-sm font-semibold tracking-wide text-subtle uppercase">
          學校
        </h2>
        <Dl>
          <Dt>類別</Dt>
          <Dd>{CATEGORY_LABEL[app.schoolCategory as SchoolCategory] ?? app.schoolCategory}</Dd>
          <Dt>分區</Dt>
          <Dd>{DISTRICT_LABEL[app.schoolDistrict as District] ?? app.schoolDistrict}</Dd>
          <Dt>地址</Dt>
          <Dd>{app.schoolAddress}</Dd>
          <Dt>學段</Dt>
          <Dd>{LEVEL_LABEL[app.level]}</Dd>
        </Dl>
      </section>

      <section className="mb-6 space-y-4 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-sm font-semibold tracking-wide text-subtle uppercase">
          負責人（僅管理員可見）
        </h2>
        <Dl>
          <Dt>姓名</Dt>
          <Dd>{app.teacherName}</Dd>
          <Dt>職銜</Dt>
          <Dd>
            {TITLE_LABEL[app.teacherTitle as TeacherTitle] ?? app.teacherTitle}
            {app.teacherTitleOther ? ` · ${app.teacherTitleOther}` : ""}
          </Dd>
          <Dt>電郵</Dt>
          <Dd>
            <a href={`mailto:${app.teacherEmail}`} className="text-accent-3 hover:text-fg">
              {app.teacherEmail}
            </a>
          </Dd>
          <Dt>WhatsApp</Dt>
          <Dd>
            <a href={`tel:${app.teacherPhone}`} className="text-accent-3 hover:text-fg">
              {app.teacherPhone}
            </a>
          </Dd>
        </Dl>
      </section>

      <section className="mb-6 space-y-4 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-sm font-semibold tracking-wide text-subtle uppercase">
          賽道與硬件
        </h2>
        <ul className="space-y-2 text-sm text-muted">
          {app.tracks.map((t) => (
            <li key={t}>
              <span className="text-fg">{TRACK_META[t].title[app.level]}</span>
              <span className="mt-0.5 block text-subtle">{TRACK_META[t].caption[app.level]}</span>
            </li>
          ))}
        </ul>
        {kit && kit.p1 ? (
          <ol className="space-y-1 text-sm text-muted">
            <li>第 1 選擇：{KIT_LABEL[kit.p1 as KitId] ?? kit.p1}</li>
            <li>第 2 選擇：{KIT_LABEL[kit.p2 as KitId] ?? kit.p2}</li>
            <li>第 3 選擇：{KIT_LABEL[kit.p3 as KitId] ?? kit.p3}</li>
          </ol>
        ) : null}
        {app.briefingSession ? (
          <p className="text-sm text-muted">
            簡介會：{BRIEFING_META[app.briefingSession as BriefingSession]?.date ?? app.briefingSession}
            {BRIEFING_META[app.briefingSession as BriefingSession]
              ? ` · ${BRIEFING_META[app.briefingSession as BriefingSession].venue}`
              : ""}
          </p>
        ) : null}
        {app.forceSubmit ? <p className="text-sm text-warn">此為重複提交（校方確認覆蓋）。</p> : null}
        <p className="text-xs text-subtle">提交時間 {formatHk(app.createdAt)}</p>
      </section>

      <section className="mb-6 space-y-4 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-sm font-semibold tracking-wide text-subtle uppercase">
          更新狀態
        </h2>
        <form onSubmit={onStatus} className="space-y-3">
          <select
            className="field"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <input
            className="field"
            placeholder="內部備註（選填，會記入審計紀錄）"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            maxLength={500}
          />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "儲存中…" : "更新狀態"}
          </button>
        </form>
      </section>

      <section className="mb-6 space-y-4 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-sm font-semibold tracking-wide text-subtle uppercase">
          內部備註
        </h2>
        <form onSubmit={onNote} className="space-y-3">
          <textarea
            className="field min-h-28"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            maxLength={2000}
          />
          <button type="submit" className="btn btn-ghost" disabled={saving}>
            儲存備註
          </button>
        </form>
      </section>

      <section className="mb-10 space-y-3 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-sm font-semibold tracking-wide text-subtle uppercase">
          審計紀錄
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-subtle">尚無紀錄</p>
        ) : (
          <ol className="space-y-3">
            {events.map((ev) => (
              <li key={ev.id} className="border-b border-line-soft pb-3 text-sm last:border-0">
                <div className="text-fg">
                  {ev.action === "status_change"
                    ? `狀態 ${ev.fromStatus ?? "—"} → ${ev.toStatus ?? "—"}`
                    : ev.action === "submitted"
                      ? "學校提交報名"
                      : "更新備註"}
                </div>
                {ev.note ? <div className="text-muted">{ev.note}</div> : null}
                <div className="text-xs text-subtle">
                  {formatHk(ev.createdAt)}
                  {ev.actorUserId === "public" ? "" : " · 管理員"}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

function Dl({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-2 text-sm">{children}</dl>;
}
function Dt({ children }: { children: ReactNode }) {
  return <dt className="text-subtle">{children}</dt>;
}
function Dd({ children }: { children: ReactNode }) {
  return <dd className="text-fg">{children}</dd>;
}
