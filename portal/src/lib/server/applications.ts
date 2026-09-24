import { randomInt } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  ApplicationIdSchema,
  businessValidate,
  ListQuerySchema,
  SaveNoteSchema,
  SubmitInputSchema,
  UpdateStatusSchema,
  type ListQuery,
} from "@/lib/application-schema";
import {
  BRIEFING_META,
  CATEGORY_LABEL,
  DISTRICT_LABEL,
  KIT_LABEL,
  LEVEL_LABEL,
  STATUS_LABEL,
  TITLE_LABEL,
  TRACK_LABEL,
  type BriefingSession,
  type District,
  type KitId,
  type Level,
  type SchoolCategory,
  type Status,
  type TeacherTitle,
  type Track,
} from "@/lib/catalog";
import { formatHk, todayStampHk } from "@/lib/datetime";
import { escapeLike } from "@/lib/utils";
import { requireAdmin } from "./admin";
import { workbookToBase64 } from "./xlsx";

const PAGE_SIZE = 25;
const MAX_SUBMITS_PER_EMAIL_24H = 6;
const MAX_EXPORT_ROWS = 3000;
const MAX_EXPORTS_PER_HOUR = 8;

type SubmitResult =
  | { ok: true; applicationId: string }
  | { ok: false; reason: "duplicate" | "rate_limited" | "invalid"; message?: string };

function normName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function todayStamp(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

async function mintApplicationId(): Promise<string> {
  const sql = await getSql();
  for (let i = 0; i < 12; i += 1) {
    const id = `HKATA-${todayStamp()}-${randomInt(1000, 10000)}`;
    const hit = await sql<{ application_id: string }>`
      select application_id from applications where application_id = ${id}
    `;
    if (hit.length === 0) return id;
  }
  return `HKATA-${todayStamp()}-${randomInt(100000, 1000000)}`;
}

function parseTracks(value: unknown): Track[] {
  if (Array.isArray(value)) return value as Track[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? (parsed as Track[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseKit(value: unknown): { p1: string; p2: string; p3: string } | null {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return parseKit(JSON.parse(value));
    } catch {
      return null;
    }
  }
  if (typeof value === "object" && value) {
    const o = value as Record<string, unknown>;
    return {
      p1: String(o.p1 ?? ""),
      p2: String(o.p2 ?? ""),
      p3: String(o.p3 ?? ""),
    };
  }
  return null;
}

function buildFilter(data: ListQuery, includeStatus: boolean): { clause: string; params: unknown[] } {
  const params: unknown[] = [];
  const parts: string[] = ["1=1"];

  if (includeStatus && data.status !== "all") {
    params.push(data.status);
    parts.push(`status = $${params.length}`);
  }
  if (data.level !== "all") {
    params.push(data.level);
    parts.push(`level = $${params.length}`);
  }
  if (data.district !== "all") {
    params.push(data.district);
    parts.push(`school_district = $${params.length}`);
  }
  if (data.track !== "all") {
    params.push(JSON.stringify([data.track]));
    parts.push(`tracks @> $${params.length}::jsonb`);
  }
  const q = data.q.trim();
  if (q) {
    params.push(`%${escapeLike(q)}%`);
    const p = params.length;
    parts.push(`(
      application_id ilike $${p} escape '\\'
      or school_name_cn ilike $${p} escape '\\'
      or school_name_en ilike $${p} escape '\\'
      or teacher_name ilike $${p} escape '\\'
      or teacher_email ilike $${p} escape '\\'
    )`);
  }
  if (data.fromDate) {
    params.push(`${data.fromDate}T00:00:00+08:00`);
    parts.push(`created_at >= $${params.length}::timestamptz`);
  }
  if (data.toDate) {
    params.push(`${data.toDate}T23:59:59.999+08:00`);
    parts.push(`created_at <= $${params.length}::timestamptz`);
  }

  return { clause: parts.join(" AND "), params };
}

export type ApplicationListItem = {
  id: number;
  applicationId: string;
  schoolNameCn: string;
  schoolNameEn: string;
  level: Level;
  tracks: Track[];
  status: Status;
  forceSubmit: boolean;
  createdAt: string;
};

export type ApplicationDetail = ApplicationListItem & {
  schoolCategory: string;
  schoolDistrict: string;
  schoolAddress: string;
  teacherName: string;
  teacherTitle: string;
  teacherTitleOther: string;
  teacherEmail: string;
  teacherPhone: string;
  kitPriority: { p1: string; p2: string; p3: string } | null;
  briefingSession: string;
  referrerLevel: string;
  adminNote: string;
  updatedAt: string;
};

export type ApplicationEvent = {
  id: number;
  actorUserId: string;
  action: string;
  fromStatus: string | null;
  toStatus: string | null;
  note: string;
  createdAt: string;
};

function toListItem(row: {
  id: number;
  application_id: string;
  school_name_cn: string;
  school_name_en: string;
  level: string;
  tracks: unknown;
  status: string;
  force_submit: boolean;
  created_at: string;
}): ApplicationListItem {
  return {
    id: row.id,
    applicationId: row.application_id,
    schoolNameCn: row.school_name_cn,
    schoolNameEn: row.school_name_en,
    level: row.level as Level,
    tracks: parseTracks(row.tracks),
    status: row.status as Status,
    forceSubmit: Boolean(row.force_submit),
    createdAt: String(row.created_at),
  };
}

export const submitApplication = createServerFn({ method: "POST" })
  .validator((data: unknown) => SubmitInputSchema.parse(data))
  .handler(async ({ data }): Promise<SubmitResult> => {
    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    assertSameSiteRequest();

    if (data.website) {
      return { ok: true, applicationId: `HKATA-${todayStamp()}-0000` };
    }

    const invalid = businessValidate(data);
    if (invalid) return { ok: false, reason: "invalid", message: invalid };

    const sql = await getSql();
    const emailNorm = data.teacherEmail.toLowerCase();
    const schoolNorm = normName(data.schoolNameEn);

    await sql`insert into submit_attempts (email_norm) values (${emailNorm})`;
    const recent = await sql<{ n: number }>`
      select count(*)::int as n
      from submit_attempts
      where email_norm = ${emailNorm}
        and created_at > now() - interval '24 hours'
    `;
    if ((recent[0]?.n ?? 0) > MAX_SUBMITS_PER_EMAIL_24H) {
      return { ok: false, reason: "rate_limited", message: "提交次數過多，請稍後再試或聯絡秘書處。" };
    }

    if (!data.forceSubmit) {
      const dup = await sql<{ id: number }>`
        select id from applications
        where school_name_en_norm = ${schoolNorm}
        limit 1
      `;
      if (dup.length > 0) return { ok: false, reason: "duplicate" };
    }

    const applicationId = await mintApplicationId();
    const tracksJson = JSON.stringify(data.tracks);
    const kitJson =
      data.level === "kindergarten" || !data.tracks.includes("engineering")
        ? null
        : JSON.stringify(data.kitPriority);
    const titleOther = data.teacherTitle === "other" ? data.teacherTitleOther : "";
    const briefing =
      data.level !== "kindergarten" && data.tracks.includes("engineering")
        ? data.briefingSession
        : "";

    const inserted = await sql.query<{ id: number }>(
      `insert into applications (
        application_id, school_name_cn, school_name_en, school_name_en_norm,
        school_category, school_district, school_address,
        teacher_name, teacher_title, teacher_title_other,
        teacher_email, teacher_email_norm, teacher_phone,
        level, tracks, kit_priority, briefing_session, referrer_level,
        force_submit, status
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb,$17,$18,$19,'submitted'
      ) returning id`,
      [
        applicationId,
        data.schoolNameCn,
        data.schoolNameEn,
        schoolNorm,
        data.schoolCategory,
        data.schoolDistrict,
        data.schoolAddress,
        data.teacherName,
        data.teacherTitle,
        titleOther,
        data.teacherEmail,
        emailNorm,
        data.teacherPhone,
        data.level,
        tracksJson,
        kitJson,
        briefing,
        data.referrerLevel || "",
        Boolean(data.forceSubmit),
      ],
    );

    const rowId = inserted[0]?.id;
    if (rowId) {
      await sql`
        insert into application_events (application_id, actor_user_id, action, to_status, note)
        values (${rowId}, ${"public"}, ${"submitted"}, ${"submitted"}, ${data.forceSubmit ? "duplicate override" : ""})
      `;
    }

    return { ok: true, applicationId };
  });

export const getAdminContext = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      await requireAdmin(context.userId);
      return { isAdmin: true };
    } catch {
      return { isAdmin: false };
    }
  });

export const listApplications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: unknown) => ListQuerySchema.parse(data ?? {}))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const page = data.page;
    const offset = (page - 1) * PAGE_SIZE;
    const { clause, params } = buildFilter(data, true);
    const limitIdx = params.length + 1;
    const offsetIdx = params.length + 2;

    const rows = await sql.query<{
      id: number;
      application_id: string;
      school_name_cn: string;
      school_name_en: string;
      level: string;
      tracks: unknown;
      status: string;
      force_submit: boolean;
      created_at: string;
      total: number;
    }>(
      `select id, application_id, school_name_cn, school_name_en, level, tracks, status,
              force_submit, created_at::text as created_at,
              count(*) over()::int as total
       from applications
       where ${clause}
       order by created_at desc
       limit $${limitIdx} offset $${offsetIdx}`,
      [...params, PAGE_SIZE, offset],
    );

    const total = rows[0]?.total ?? 0;
    return {
      items: rows.map(toListItem),
      total,
      page,
      pageSize: PAGE_SIZE,
    };
  });

export const countByStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: unknown) => ListQuerySchema.parse(data ?? {}))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const { clause, params } = buildFilter(data, false);
    const rows = await sql.query<{ status: Status; n: number }>(
      `select status, count(*)::int as n from applications where ${clause} group by status`,
      params,
    );
    const totalRow = await sql.query<{ n: number }>(
      `select count(*)::int as n from applications where ${clause}`,
      params,
    );
    const byStatus: Record<Status, number> = {
      submitted: 0,
      reviewing: 0,
      approved: 0,
      waitlisted: 0,
      rejected: 0,
    };
    for (const r of rows) byStatus[r.status] = r.n;
    return { total: totalRow[0]?.n ?? 0, byStatus };
  });

export const getApplication = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: unknown) => ApplicationIdSchema.parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql.query<{
      id: number;
      application_id: string;
      school_name_cn: string;
      school_name_en: string;
      school_category: string;
      school_district: string;
      school_address: string;
      teacher_name: string;
      teacher_title: string;
      teacher_title_other: string;
      teacher_email: string;
      teacher_phone: string;
      level: string;
      tracks: unknown;
      kit_priority: unknown;
      briefing_session: string;
      referrer_level: string;
      force_submit: boolean;
      status: string;
      admin_note: string;
      created_at: string;
      updated_at: string;
    }>(
      `select id, application_id, school_name_cn, school_name_en, school_category,
              school_district, school_address, teacher_name, teacher_title,
              teacher_title_other, teacher_email, teacher_phone, level, tracks,
              kit_priority, briefing_session, referrer_level, force_submit, status,
              admin_note, created_at::text as created_at, updated_at::text as updated_at
       from applications where id = $1`,
      [data.id],
    );
    const row = rows[0];
    if (!row) return null;

    const events = await sql.query<{
      id: number;
      actor_user_id: string;
      action: string;
      from_status: string | null;
      to_status: string | null;
      note: string;
      created_at: string;
    }>(
      `select id, actor_user_id, action, from_status, to_status, note, created_at::text as created_at
       from application_events where application_id = $1 order by created_at desc`,
      [data.id],
    );

    const detail: ApplicationDetail = {
      ...toListItem(row),
      schoolCategory: row.school_category,
      schoolDistrict: row.school_district,
      schoolAddress: row.school_address,
      teacherName: row.teacher_name,
      teacherTitle: row.teacher_title,
      teacherTitleOther: row.teacher_title_other,
      teacherEmail: row.teacher_email,
      teacherPhone: row.teacher_phone,
      kitPriority: parseKit(row.kit_priority),
      briefingSession: row.briefing_session,
      referrerLevel: row.referrer_level,
      adminNote: row.admin_note,
      updatedAt: String(row.updated_at),
    };

    const eventList: ApplicationEvent[] = events.map((e) => ({
      id: e.id,
      actorUserId: e.actor_user_id,
      action: e.action,
      fromStatus: e.from_status,
      toStatus: e.to_status,
      note: e.note,
      createdAt: String(e.created_at),
    }));

    return { application: detail, events: eventList };
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => UpdateStatusSchema.parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const current = await sql<{ id: number; status: Status }>`
      select id, status from applications where id = ${data.id}
    `;
    const row = current[0];
    if (!row) throw new Error("Not found");
    if (row.status === data.status) {
      return { ok: true as const, status: row.status };
    }
    await sql`
      update applications
      set status = ${data.status}, updated_at = now()
      where id = ${data.id}
    `;
    await sql`
      insert into application_events (application_id, actor_user_id, action, from_status, to_status, note)
      values (${data.id}, ${context.userId}, ${"status_change"}, ${row.status}, ${data.status}, ${data.note})
    `;
    return { ok: true as const, status: data.status };
  });

export const saveAdminNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => SaveNoteSchema.parse(data))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const updated = await sql<{ id: number }>`
      update applications
      set admin_note = ${data.note}, updated_at = now()
      where id = ${data.id}
      returning id
    `;
    if (updated.length === 0) throw new Error("Not found");
    await sql`
      insert into application_events (application_id, actor_user_id, action, note)
      values (${data.id}, ${context.userId}, ${"note"}, ${data.note})
    `;
    return { ok: true as const };
  });

const EXPORT_HEADERS = [
  "申請編號",
  "狀態",
  "提交時間",
  "學校中文名稱",
  "學校英文名稱",
  "學校類別",
  "分區",
  "學校地址",
  "負責人姓名",
  "職銜",
  "電郵",
  "WhatsApp",
  "報名學段",
  "賽道",
  "硬件第1選擇",
  "硬件第2選擇",
  "硬件第3選擇",
  "簡介會",
  "轉介學段",
  "重複提交",
  "內部備註",
];

export const exportApplications = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => ListQuerySchema.parse(data ?? {}))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();

    const recent = await sql<{ n: number }>`
      select count(*)::int as n
      from admin_audit
      where actor_user_id = ${context.userId}
        and action = ${"export"}
        and created_at > now() - interval '1 hour'
    `;
    if ((recent[0]?.n ?? 0) >= MAX_EXPORTS_PER_HOUR) {
      throw new Error("匯出次數過多，請稍後再試");
    }

    const { clause, params } = buildFilter(data, true);
    const rows = await sql.query<{
      application_id: string;
      school_name_cn: string;
      school_name_en: string;
      school_category: string;
      school_district: string;
      school_address: string;
      teacher_name: string;
      teacher_title: string;
      teacher_title_other: string;
      teacher_email: string;
      teacher_phone: string;
      level: string;
      tracks: unknown;
      kit_priority: unknown;
      briefing_session: string;
      referrer_level: string;
      force_submit: boolean;
      status: string;
      admin_note: string;
      created_at: string;
    }>(
      `select application_id, school_name_cn, school_name_en, school_category,
              school_district, school_address, teacher_name, teacher_title,
              teacher_title_other, teacher_email, teacher_phone, level, tracks,
              kit_priority, briefing_session, referrer_level, force_submit, status,
              admin_note, created_at::text as created_at
       from applications
       where ${clause}
       order by created_at desc
       limit ${MAX_EXPORT_ROWS + 1}`,
      params,
    );

    if (rows.length > MAX_EXPORT_ROWS) {
      throw new Error("結果超過 3000 筆，請收窄篩選後再匯出");
    }

    const sheetRows = rows.map((row) => {
      const level = row.level as Level;
      const tracks = parseTracks(row.tracks);
      const kit = parseKit(row.kit_priority);
      const briefing = row.briefing_session as BriefingSession;
      const title =
        (TITLE_LABEL[row.teacher_title as TeacherTitle] ?? row.teacher_title) +
        (row.teacher_title_other ? ` · ${row.teacher_title_other}` : "");
      const briefingLabel = BRIEFING_META[briefing]
        ? `${BRIEFING_META[briefing].date} ${BRIEFING_META[briefing].time} · ${BRIEFING_META[briefing].venue}`
        : row.briefing_session;
      return [
        row.application_id,
        STATUS_LABEL[row.status as Status] ?? row.status,
        formatHk(row.created_at),
        row.school_name_cn,
        row.school_name_en,
        CATEGORY_LABEL[row.school_category as SchoolCategory] ?? row.school_category,
        DISTRICT_LABEL[row.school_district as District] ?? row.school_district,
        row.school_address,
        row.teacher_name,
        title,
        row.teacher_email,
        row.teacher_phone,
        LEVEL_LABEL[level] ?? row.level,
        tracks.map((t) => TRACK_LABEL[t] ?? t).join("、"),
        kit?.p1 ? (KIT_LABEL[kit.p1 as KitId] ?? kit.p1) : "",
        kit?.p2 ? (KIT_LABEL[kit.p2 as KitId] ?? kit.p2) : "",
        kit?.p3 ? (KIT_LABEL[kit.p3 as KitId] ?? kit.p3) : "",
        briefingLabel,
        row.referrer_level ? (LEVEL_LABEL[row.referrer_level as Level] ?? row.referrer_level) : "",
        row.force_submit ? "是" : "否",
        row.admin_note,
      ];
    });

    const filename = `HKATA-報名-${todayStampHk()}.xlsx`;
    const base64 = workbookToBase64("報名", EXPORT_HEADERS, sheetRows);

    await sql`
      insert into admin_audit (actor_user_id, action, detail)
      values (
        ${context.userId},
        ${"export"},
        ${JSON.stringify({
          count: rows.length,
          status: data.status,
          level: data.level,
          track: data.track,
          district: data.district,
          q: data.q ? "set" : "",
          fromDate: data.fromDate,
          toDate: data.toDate,
        })}
      )
    `;

    return { filename, base64, count: rows.length };
  });

