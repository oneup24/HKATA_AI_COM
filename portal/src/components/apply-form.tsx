import { useState, type FormEvent, type ReactNode } from "react";
import {
  BRIEFING_META,
  CATEGORY_LABEL,
  DISTRICT_GROUPS,
  DISTRICT_LABEL,
  KITS_FOR_LEVEL,
  KIT_LABEL,
  LEVELS,
  LEVEL_LABEL,
  LEVEL_SUB,
  SCHOOL_CATEGORIES,
  TITLE_LABEL,
  TEACHER_TITLES,
  TRACKS_FOR_LEVEL,
  TRACK_META,
  type BriefingSession,
  type District,
  type KitId,
  type Level,
  type SchoolCategory,
  type TeacherTitle,
  type Track,
} from "@/lib/catalog";
import { submitApplication } from "@/lib/server/applications";
import { cn } from "@/lib/utils";
import { Modal } from "./modal";
import { Check, Clock, MapPin, Rocket, School, Trophy, User } from "lucide-react";

const EMPTY_KIT = { p1: "" as KitId | "", p2: "" as KitId | "", p3: "" as KitId | "" };

type FormState = {
  schoolNameCn: string;
  schoolNameEn: string;
  schoolCategory: SchoolCategory | "";
  schoolDistrict: District | "";
  schoolAddress: string;
  teacherName: string;
  teacherTitle: TeacherTitle | "";
  teacherTitleOther: string;
  teacherEmail: string;
  teacherPhone: string;
  level: Level | "";
  tracks: Track[];
  kitPriority: { p1: KitId | ""; p2: KitId | ""; p3: KitId | "" };
  briefingSession: BriefingSession | "";
  referrerLevel: Level | "";
  consent: boolean;
  website: string;
};

function defaultsForLevel(level: Level): Pick<FormState, "tracks" | "kitPriority" | "briefingSession"> {
  return {
    tracks: [...TRACKS_FOR_LEVEL[level]],
    kitPriority: { ...EMPTY_KIT },
    briefingSession: "",
  };
}

function initialState(levelFromUrl?: string): FormState {
  const level = LEVELS.includes(levelFromUrl as Level) ? (levelFromUrl as Level) : "";
  return {
    schoolNameCn: "",
    schoolNameEn: "",
    schoolCategory: level || "",
    schoolDistrict: "",
    schoolAddress: "",
    teacherName: "",
    teacherTitle: "",
    teacherTitleOther: "",
    teacherEmail: "",
    teacherPhone: "",
    level,
    tracks: level ? [...TRACKS_FOR_LEVEL[level]] : [],
    kitPriority: { ...EMPTY_KIT },
    briefingSession: "",
    referrerLevel: level,
    consent: false,
    website: "",
  };
}

export function ApplyForm({ levelFromUrl }: { levelFromUrl?: string }) {
  const [form, setForm] = useState<FormState>(() => initialState(levelFromUrl));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);

  const needsEngineering =
    form.level !== "" &&
    form.level !== "kindergarten" &&
    form.tracks.includes("engineering");
  const kits = form.level && form.level !== "kindergarten" ? KITS_FOR_LEVEL[form.level] : [];
  const briefings = (Object.keys(BRIEFING_META) as BriefingSession[]).filter(
    (id) => form.level && BRIEFING_META[id].level === form.level,
  );

  function setLevel(level: Level) {
    setForm((f) => ({
      ...f,
      level,
      referrerLevel: level,
      ...defaultsForLevel(level),
    }));
  }

  function toggleTrack(track: Track) {
    setForm((f) => {
      const has = f.tracks.includes(track);
      const tracks = has ? f.tracks.filter((t) => t !== track) : [...f.tracks, track];
      const keepKit = tracks.includes("engineering") && f.level !== "kindergarten";
      return {
        ...f,
        tracks,
        kitPriority: keepKit ? f.kitPriority : { ...EMPTY_KIT },
        briefingSession: keepKit ? f.briefingSession : "",
      };
    });
  }

  async function doSubmit(forceSubmit: boolean) {
    setError("");
    if (!form.consent) {
      setError("請先同意資料收集及處理條款");
      return;
    }
    if (!form.level) {
      setError("請選擇報名學段");
      return;
    }
    if (form.tracks.length === 0) {
      setError("請至少選擇一個參賽賽道");
      return;
    }
    if (!form.schoolCategory || !form.schoolDistrict || !form.teacherTitle) {
      setError("請填妥所有必填欄位");
      return;
    }
    setPending(true);
    try {
      const result = await submitApplication({
        data: {
          schoolNameCn: form.schoolNameCn,
          schoolNameEn: form.schoolNameEn,
          schoolCategory: form.schoolCategory,
          schoolDistrict: form.schoolDistrict,
          schoolAddress: form.schoolAddress,
          teacherName: form.teacherName,
          teacherTitle: form.teacherTitle,
          teacherTitleOther: form.teacherTitleOther,
          teacherEmail: form.teacherEmail,
          teacherPhone: form.teacherPhone,
          level: form.level,
          tracks: form.tracks,
          kitPriority: needsEngineering ? form.kitPriority : null,
          briefingSession: form.briefingSession,
          referrerLevel: form.referrerLevel || form.level,
          consent: true as const,
          forceSubmit,
          website: form.website,
        },
      });
      if (result.ok) {
        setDuplicate(false);
        setSuccessId(result.applicationId);
        return;
      }
      if (result.reason === "duplicate") {
        setDuplicate(true);
        return;
      }
      setError(result.message ?? "提交失敗，請稍後再試。");
    } catch {
      setError("提交失敗，請檢查網絡後再試。");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void doSubmit(false);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div className="space-y-6 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <div className="border-b border-line-soft pb-5">
            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-fg">
              <School className="size-5 text-accent-3" />
              學校基本資料
            </h2>
            <p className="text-sm text-subtle">請填寫貴校官方登記名稱（同教育局學校註冊證明書）。</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="學校中文全稱">
              <input
                className="field"
                required
                value={form.schoolNameCn}
                onChange={(e) => setForm({ ...form, schoolNameCn: e.target.value })}
                placeholder="例:XXXX 學校"
                autoComplete="organization"
                maxLength={200}
              />
            </Field>
            <Field label="學校英文全稱">
              <input
                className="field"
                required
                value={form.schoolNameEn}
                onChange={(e) => setForm({ ...form, schoolNameEn: e.target.value })}
                placeholder="e.g. XXXX School"
                autoComplete="off"
                maxLength={200}
              />
            </Field>
            <Field label="學校類別">
              <select
                className="field"
                required
                value={form.schoolCategory}
                onChange={(e) =>
                  setForm({ ...form, schoolCategory: e.target.value as SchoolCategory })
                }
              >
                <option value="" disabled>
                  請選擇學校類別
                </option>
                {SCHOOL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="所屬分區">
              <select
                className="field"
                required
                value={form.schoolDistrict}
                onChange={(e) => setForm({ ...form, schoolDistrict: e.target.value as District })}
              >
                <option value="" disabled>
                  請選擇校舍地區
                </option>
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
            </Field>
            <div className="sm:col-span-2">
              <Field label="校舍通訊地址">
                <input
                  className="field"
                  required
                  value={form.schoolAddress}
                  onChange={(e) => setForm({ ...form, schoolAddress: e.target.value })}
                  placeholder="請填寫完整校舍地址"
                  autoComplete="street-address"
                  maxLength={300}
                />
              </Field>
            </div>
          </div>

          <div className="border-b border-line-soft pb-5">
            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-fg">
              <User className="size-5 text-accent-3" />
              初步建議負責人
            </h2>
            <p className="text-sm text-subtle">此為貴校初步建議之帶隊負責人，秘書處核實後仍可更改。</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="負責人姓名">
              <input
                className="field"
                required
                value={form.teacherName}
                onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                placeholder="例:陳 X X 老師"
                autoComplete="name"
                maxLength={100}
              />
            </Field>
            <Field label="職銜 / 職位">
              <select
                className="field"
                required
                value={form.teacherTitle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    teacherTitle: e.target.value as TeacherTitle,
                    teacherTitleOther:
                      e.target.value === "other" ? form.teacherTitleOther : "",
                  })
                }
              >
                <option value="" disabled>
                  請選擇職銜 / 職位
                </option>
                {TEACHER_TITLES.map((t) => (
                  <option key={t} value={t}>
                    {TITLE_LABEL[t]}
                  </option>
                ))}
              </select>
              {form.teacherTitle === "other" ? (
                <input
                  className="field mt-2"
                  value={form.teacherTitleOther}
                  onChange={(e) => setForm({ ...form, teacherTitleOther: e.target.value })}
                  placeholder="請說明其他職銜"
                  maxLength={100}
                />
              ) : null}
            </Field>
            <Field label="負責人電郵（接收大賽通告）">
              <input
                className="field"
                type="email"
                required
                value={form.teacherEmail}
                onChange={(e) => setForm({ ...form, teacherEmail: e.target.value })}
                placeholder="teacher@xxxx.edu.hk"
                autoComplete="email"
                maxLength={254}
              />
            </Field>
            <Field label="負責人 WhatsApp">
              <input
                className="field"
                type="tel"
                required
                value={form.teacherPhone}
                onChange={(e) => setForm({ ...form, teacherPhone: e.target.value })}
                placeholder="+852 9123 4567"
                autoComplete="tel"
                maxLength={30}
              />
            </Field>
          </div>

          <div>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-fg">
              <Trophy className="size-5 text-accent-3" />
              比賽選擇
            </h2>
            <p className="text-sm text-subtle">
              請選擇貴校擬參加的學段賽道。完成後秘書處會依學段確認章程與硬件套件安排。
            </p>
          </div>

          <div>
            <span className="field-label">
              報名學段 <span className="text-gold-soft">*</span>
            </span>
            <div className="grid gap-3 sm:grid-cols-3">
              {LEVELS.map((level) => (
                <label
                  key={level}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border bg-surface p-4 transition-colors",
                    form.level === level
                      ? "border-accent bg-accent/10"
                      : "border-line hover:border-accent-2",
                  )}
                >
                  <input
                    type="radio"
                    name="segment"
                    className="accent-accent"
                    checked={form.level === level}
                    onChange={() => setLevel(level)}
                    required
                  />
                  <div>
                    <div className="text-sm font-bold text-fg">{LEVEL_LABEL[level]}</div>
                    <div className="text-sm text-subtle">{LEVEL_SUB[level]}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {form.level ? (
            <TrackPicker
              level={form.level}
              tracks={form.tracks}
              onToggle={toggleTrack}
            />
          ) : null}

          {needsEngineering ? (
            <div>
              <span className="field-label">
                硬件優次選擇 <span className="text-gold-soft">*</span>
              </span>
              <p className="mb-3 text-sm text-subtle">
                請按優次選擇 3 款硬件套件。秘書處將按優次以抽籤方式分配。
              </p>
              {(["p1", "p2", "p3"] as const).map((key, i) => (
                <div key={key} className="mb-3 flex items-center gap-3">
                  <span className="w-16 shrink-0 font-display text-sm text-gold-soft">
                    第 {i + 1} 選擇
                  </span>
                  <select
                    className="field flex-1"
                    required
                    value={form.kitPriority[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        kitPriority: {
                          ...form.kitPriority,
                          [key]: e.target.value as KitId | "",
                        },
                      })
                    }
                  >
                    <option value="">— 請選擇 —</option>
                    {kits.map((k) => (
                      <option key={k} value={k}>
                        {KIT_LABEL[k]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : null}

          {needsEngineering ? (
            <div className="space-y-3">
              <span className="field-label">
                比賽簡介會 <span className="text-gold-soft">*</span>
              </span>
              <p className="text-sm text-subtle">請選擇一場簡介會出席。秘書處將於會前發送確認通知。</p>
              <p className="font-display text-xs tracking-[0.18em] text-subtle uppercase">
                {form.level === "secondary" ? "中學組場次" : "小學組場次"}
              </p>
              {briefings.map((id) => {
                const meta = BRIEFING_META[id];
                const selected = form.briefingSession === id;
                return (
                  <label key={id} className="block cursor-pointer">
                    <input
                      type="radio"
                      name="briefingSession"
                      className="sr-only"
                      checked={selected}
                      onChange={() => setForm({ ...form, briefingSession: id })}
                      required
                    />
                    <div
                      className={cn(
                        "rounded-xl border-2 p-4 transition-colors",
                        selected
                          ? "border-gold-soft bg-gold-soft/10"
                          : "border-line hover:border-accent-3",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-1 size-4 shrink-0 rounded-full border-2",
                            selected
                              ? "border-gold-soft bg-gold-soft"
                              : "border-line-strong bg-transparent",
                          )}
                        />
                        <div className="flex-1">
                          <div className="mb-1 flex flex-wrap items-baseline gap-2">
                            <span className="font-display text-sm font-bold text-accent-3">
                              {meta.date}
                            </span>
                            <span className="text-xs text-gold-soft">{meta.note}</span>
                          </div>
                          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
                            <Clock className="size-3.5 text-subtle" />
                            {meta.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <MapPin className="size-3.5 text-subtle" />
                            {meta.venue}
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          ) : null}

          <label className="hp-field" aria-hidden="true">
            公司網址
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </label>
        </div>

        <div className="flex flex-col items-center gap-3">
          <label className="flex max-w-xl cursor-pointer items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              className="mt-1 accent-accent"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              required
            />
            <span>本人已閱讀並同意大會秘書處收集及處理上述資料，作報名審核及聯絡用途。</span>
          </label>
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn btn-gold px-10 py-4 text-base" disabled={pending}>
            <Rocket className="size-4" />
            {pending ? "提交中…" : "提交學校報名"}
          </button>
        </div>
      </form>

      <Modal
        open={Boolean(successId)}
        title="感謝您的報名！"
        onClose={() => setSuccessId(null)}
      >
        <div className="mb-4 grid size-12 place-items-center rounded-full bg-ok/15 text-ok">
          <Check className="size-6" />
        </div>
        <p className="text-sm text-muted">秘書處已收到貴校之報名。請記下您的申請編號：</p>
        <div className="my-4 rounded-lg border border-gold/40 bg-bg px-4 py-3 text-center font-display text-lg font-semibold tracking-wide text-gold-soft">
          {successId}
        </div>
        <p className="mb-6 text-sm text-subtle">
          秘書處將於 <span className="text-gold-soft">11月下旬</span>{" "}
          官宣抽籤分組結果，並通知校方領取官方「硬件套件」。
        </p>
        <button type="button" className="btn btn-gold px-8" onClick={() => setSuccessId(null)}>
          關閉
        </button>
      </Modal>

      <Modal open={duplicate} title="此學校已申請過" onClose={() => setDuplicate(false)}>
        <p className="mb-2 text-sm text-muted">
          <strong className="text-fg">{form.schoolNameEn}</strong> 已於本系統登記。
        </p>
        <p className="mb-2 text-sm text-muted">請先再次核對學校名稱是否正確：</p>
        <ul className="mb-4 space-y-1 text-sm text-subtle">
          <li>· 如屬輸入錯誤，請按「返回核對」並修改學校名稱</li>
          <li>· 如確認資料正確並需要重新提交（例如更新聯絡人資料），請按「仍然提交」</li>
        </ul>
        <p className="mb-6 text-sm text-subtle">
          如有疑問，請電郵秘書處{" "}
          <a href="mailto:support@hkata.space" className="text-accent-3 hover:text-fg">
            support@hkata.space
          </a>
          。
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setDuplicate(false)}
          >
            返回核對
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={pending}
            onClick={() => void doSubmit(true)}
          >
            仍然提交
          </button>
        </div>
      </Modal>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="field-label">
        {label} <span className="text-gold-soft">*</span>
      </label>
      {children}
    </div>
  );
}

function TrackPicker({
  level,
  tracks,
  onToggle,
}: {
  level: Level;
  tracks: Track[];
  onToggle: (track: Track) => void;
}) {
  return (
    <div>
      <span className="field-label">
        參賽賽道 <span className="text-gold-soft">*</span>
      </span>
      <p className="mb-3 text-sm text-subtle">
        可選多項。秘書處將以抽籤方式分配各校之賽道及硬件套件。
      </p>
      <div className="space-y-2">
        {TRACKS_FOR_LEVEL[level].map((track) => (
          <label
            key={track}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border bg-surface p-3",
              tracks.includes(track) ? "border-accent" : "border-line hover:border-accent-2",
            )}
          >
            <input
              type="checkbox"
              className="mt-1 accent-accent"
              checked={tracks.includes(track)}
              onChange={() => onToggle(track)}
            />
            <div>
              <div className="text-sm font-bold text-fg">{TRACK_META[track].title[level]}</div>
              <div className="text-sm text-subtle">{TRACK_META[track].caption[level]}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
