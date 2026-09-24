import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/modal";
import { StatusBadge } from "@/components/status-badge";
import {
  DISTRICT_GROUPS,
  DISTRICT_LABEL,
  LEVELS,
  LEVEL_LABEL,
  STATUSES,
  STATUS_LABEL,
  TRACKS,
  TRACK_LABEL,
  TRACK_META,
  type District,
  type Level,
  type Status,
  type Track,
} from "@/lib/catalog";
import { formatHk } from "@/lib/datetime";
import {
  countByStatus,
  exportApplications,
  listApplications,
  type ApplicationListItem,
} from "@/lib/server/applications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/adminportal/")({
  component: AdminHome,
});

type FilterState = {
  status: Status | "all";
  level: Level | "all";
  track: Track | "all";
  district: District | "all";
  q: string;
  fromDate: string;
  toDate: string;
};

const EMPTY_FILTERS: FilterState = {
  status: "all",
  level: "all",
  track: "all",
  district: "all",
  q: "",
  fromDate: "",
  toDate: "",
};

function AdminHome() {
  const [status, setStatus] = useState<Status | "all">("all");
  const [level, setLevel] = useState<Level | "all">("all");
  const [track, setTrack] = useState<Track | "all">("all");
  const [district, setDistrict] = useState<District | "all">("all");
  const [q, setQ] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<ApplicationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [counts, setCounts] = useState<{ total: number; byStatus: Record<Status, number> } | null>(
    null,
  );
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 250);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [status, level, track, district, debounced, fromDate, toDate]);

  const query = useMemo(
    () => ({
      status,
      level,
      track,
      district,
      q: debounced,
      fromDate,
      toDate,
      page,
    }),
    [status, level, track, district, debounced, fromDate, toDate, page],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([
      listApplications({ data: query }),
      countByStatus({ data: { ...query, status: "all", page: 1 } }),
    ])
      .then(([list, c]) => {
        if (cancelled) return;
        setItems(list.items);
        setTotal(list.total);
        setPageSize(list.pageSize);
        setCounts(c);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "無法載入";
        setError(msg === "Unauthorized" ? "請先登入" : msg === "Forbidden" ? "未獲授權" : "無法載入報名資料");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  const stats = useMemo(() => {
    if (!counts) return [];
    return [
      { key: "all" as const, label: "全部", n: counts.total },
      ...STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s], n: counts.byStatus[s] })),
    ];
  }, [counts]);

  const filtersDirty =
    status !== "all" ||
    level !== "all" ||
    track !== "all" ||
    district !== "all" ||
    q.trim() !== "" ||
    fromDate !== "" ||
    toDate !== "";

  function clearFilters() {
    setStatus(EMPTY_FILTERS.status);
    setLevel(EMPTY_FILTERS.level);
    setTrack(EMPTY_FILTERS.track);
    setDistrict(EMPTY_FILTERS.district);
    setQ(EMPTY_FILTERS.q);
    setFromDate(EMPTY_FILTERS.fromDate);
    setToDate(EMPTY_FILTERS.toDate);
  }

  async function onExport() {
    setExporting(true);
    setExportMsg("");
    try {
      const result = await exportApplications({
        data: { status, level, track, district, q: debounced, fromDate, toDate, page: 1 },
      });
      downloadXlsx(result.filename, result.base64);
      setExportOpen(false);
      setExportMsg(`已匯出 ${result.count} 筆`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "無法匯出";
      setExportMsg(msg === "Unauthorized" ? "請先登入" : msg === "Forbidden" ? "未獲授權" : msg);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">報名管理</h1>
          <p className="mt-1 text-sm text-subtle">僅顯示摘要。聯絡資料只在詳細頁及 Excel 匯出可見。</p>
        </div>
        <button
          type="button"
          className="btn btn-gold px-4 py-2 text-xs"
          disabled={total === 0 || loading}
          onClick={() => {
            setExportMsg("");
            setExportOpen(true);
          }}
        >
          <Download className="size-4" />
          匯出 Excel
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStatus(s.key)}
            className={cn(
              "rounded-xl border px-3 py-3 text-left transition-colors",
              status === s.key ? "border-accent bg-accent/10" : "border-line bg-panel hover:border-line-strong",
            )}
          >
            <div className="text-xs text-subtle">{s.label}</div>
            <div className="mt-1 font-display text-xl font-semibold text-fg">{s.n}</div>
          </button>
        ))}
      </div>

      <div className="mb-4 space-y-3 rounded-2xl border border-line bg-panel p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
          <input
            className="field pl-10"
            placeholder="搜尋申請編號、學校、負責人姓名或電郵"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={80}
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select
            className="field"
            value={level}
            onChange={(e) => setLevel(e.target.value as Level | "all")}
            aria-label="學段"
          >
            <option value="all">全部學段</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABEL[l]}
              </option>
            ))}
          </select>
          <select
            className="field"
            value={track}
            onChange={(e) => setTrack(e.target.value as Track | "all")}
            aria-label="賽道"
          >
            <option value="all">全部賽道</option>
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {TRACK_LABEL[t]}
              </option>
            ))}
          </select>
          <select
            className="field"
            value={district}
            onChange={(e) => setDistrict(e.target.value as District | "all")}
            aria-label="分區"
          >
            <option value="all">全部分區</option>
            {DISTRICT_GROUPS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((d) => (
                  <option key={d} value={d}>
                    {DISTRICT_LABEL[d]}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <label className="block">
            <span className="sr-only">由</span>
            <input
              type="date"
              className="field"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              aria-label="由日期"
            />
          </label>
          <label className="block">
            <span className="sr-only">至</span>
            <input
              type="date"
              className="field"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              aria-label="至日期"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-subtle">
            {loading ? "載入中…" : `符合 ${total} 筆`}
          </span>
          {filtersDirty ? (
            <button type="button" className="inline-flex items-center gap-1 text-accent-3 hover:text-fg" onClick={clearFilters}>
              <X className="size-3.5" />
              清除篩選
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mb-4 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {exportMsg && !exportOpen ? (
        <p className="mb-4 text-sm text-ok" role="status">
          {exportMsg}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        {loading ? (
          <div className="space-y-3 p-6">
            <div className="h-10 animate-pulse rounded-lg bg-surface" />
            <div className="h-10 animate-pulse rounded-lg bg-surface" />
            <div className="h-10 animate-pulse rounded-lg bg-surface" />
          </div>
        ) : items.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-subtle">沒有符合條件的報名。</p>
        ) : (
          <ul className="divide-y divide-line-soft">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to="/adminportal/$id"
                  params={{ id: String(item.id) }}
                  className="block px-4 py-4 transition-colors hover:bg-surface sm:px-6"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-sm font-semibold tracking-wide text-gold-soft">
                          {item.applicationId}
                        </span>
                        {item.forceSubmit ? (
                          <span className="chip">重複提交</span>
                        ) : null}
                      </div>
                      <div className="mt-1 truncate font-medium text-fg">{item.schoolNameCn}</div>
                      <div className="truncate text-sm text-subtle">{item.schoolNameEn}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span className="chip">{LEVEL_LABEL[item.level]}</span>
                      {item.tracks.map((t) => (
                        <span key={t} className="chip">
                          {TRACK_META[t].title[item.level].split("·")[0]}
                        </span>
                      ))}
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-subtle">{formatHk(item.createdAt)}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pages > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            第 {page} / {pages} 頁 · 共 {total} 筆
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost px-4 py-2 text-xs"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              上一頁
            </button>
            <button
              type="button"
              className="btn btn-ghost px-4 py-2 text-xs"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              下一頁
            </button>
          </div>
        </div>
      ) : null}

      <Modal open={exportOpen} title="匯出 Excel" onClose={() => !exporting && setExportOpen(false)}>
        <p className="text-sm leading-relaxed text-muted">
          檔案會包含負責人電郵及電話，只供秘書處內部使用，請勿轉發。
        </p>
        <p className="mt-3 text-sm text-fg">目前篩選結果：{total} 筆</p>
        {exportMsg ? (
          <p className="mt-2 text-sm text-danger" role="alert">
            {exportMsg}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-ghost px-4 py-2 text-xs"
            disabled={exporting}
            onClick={() => setExportOpen(false)}
          >
            取消
          </button>
          <button type="button" className="btn btn-gold px-4 py-2 text-xs" disabled={exporting} onClick={onExport}>
            {exporting ? "匯出中…" : "確認匯出"}
          </button>
        </div>
      </Modal>
    </main>
  );
}

function downloadXlsx(filename: string, b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
