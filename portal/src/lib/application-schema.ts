import { z } from "zod";
import {
  ALL_KITS,
  BRIEFING_SESSIONS,
  DISTRICTS,
  KITS_FOR_LEVEL,
  LEVELS,
  SCHOOL_CATEGORIES,
  STATUSES,
  TEACHER_TITLES,
  TRACKS,
  TRACKS_FOR_LEVEL,
  type Level,
  type Track,
} from "./catalog";

const trimmed = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1).max(max));

export const SubmitInputSchema = z.object({
  schoolNameCn: trimmed(200),
  schoolNameEn: trimmed(200),
  schoolCategory: z.enum(SCHOOL_CATEGORIES),
  schoolDistrict: z.enum(DISTRICTS),
  schoolAddress: trimmed(300),
  teacherName: trimmed(100),
  teacherTitle: z.enum(TEACHER_TITLES),
  teacherTitleOther: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().max(100)),
  teacherEmail: z
    .string()
    .trim()
    .max(254)
    .transform((s) => s.toLowerCase())
    .pipe(z.email()),
  teacherPhone: trimmed(30),
  level: z.enum(LEVELS),
  tracks: z.array(z.enum(TRACKS)).min(1).max(3),
  kitPriority: z
    .object({
      p1: z.enum(ALL_KITS).or(z.literal("")),
      p2: z.enum(ALL_KITS).or(z.literal("")),
      p3: z.enum(ALL_KITS).or(z.literal("")),
    })
    .nullable(),
  briefingSession: z.enum(BRIEFING_SESSIONS).or(z.literal("")),
  referrerLevel: z.enum(LEVELS).or(z.literal("")),
  consent: z.literal(true),
  forceSubmit: z.boolean().optional().default(false),
  /** Honeypot — must stay empty. */
  website: z.string().max(200).optional().default(""),
});

export type SubmitInput = z.infer<typeof SubmitInputSchema>;

export function businessValidate(data: SubmitInput): string | null {
  const digits = data.teacherPhone.replace(/[^\d]/g, "");
  if (digits.length < 8 || digits.length > 15) {
    return "請填寫有效的聯絡電話";
  }

  if (data.teacherTitle === "other" && !data.teacherTitleOther) {
    return "請說明其他職銜";
  }

  const allowed = TRACKS_FOR_LEVEL[data.level];
  if (data.tracks.some((t) => !allowed.includes(t as Track))) {
    return "所選賽道與報名學段不符";
  }
  const uniqueTracks = new Set(data.tracks);
  if (uniqueTracks.size !== data.tracks.length) {
    return "賽道重複";
  }

  const needsKit =
    data.level !== "kindergarten" && data.tracks.includes("engineering");
  if (needsKit) {
    const kit = data.kitPriority;
    if (!kit || !kit.p1 || !kit.p2 || !kit.p3) {
      return "請完成硬件優次選擇（第 1 / 2 / 3 選擇）";
    }
    if (new Set([kit.p1, kit.p2, kit.p3]).size !== 3) {
      return "每次選擇必須為不同之硬件套件";
    }
    const allowedKits = KITS_FOR_LEVEL[data.level as Level];
    if (![kit.p1, kit.p2, kit.p3].every((k) => allowedKits.includes(k))) {
      return "硬件套件與學段不符";
    }
    if (
      !data.briefingSession ||
      (data.level === "primary" && !data.briefingSession.startsWith("pri-")) ||
      (data.level === "secondary" && !data.briefingSession.startsWith("sec-"))
    ) {
      return "請選擇比賽簡介會場次";
    }
  } else if (data.briefingSession) {
    return "此學段毋須簡介會場次";
  }

  return null;
}

export const ListQuerySchema = z.object({
  status: z.enum(STATUSES).or(z.literal("all")).optional().default("all"),
  level: z.enum(LEVELS).or(z.literal("all")).optional().default("all"),
  track: z.enum(TRACKS).or(z.literal("all")).optional().default("all"),
  district: z.enum(DISTRICTS).or(z.literal("all")).optional().default("all"),
  q: z.string().trim().max(80).optional().default(""),
  fromDate: z
    .string()
    .optional()
    .default("")
    .transform((s) => (/^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "")),
  toDate: z
    .string()
    .optional()
    .default("")
    .transform((s) => (/^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "")),
  page: z.number().int().min(1).max(500).optional().default(1),
});

export type ListQuery = z.infer<typeof ListQuerySchema>;

export const UpdateStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(STATUSES),
  note: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default(""),
});

export const SaveNoteSchema = z.object({
  id: z.number().int().positive(),
  note: z.string().trim().max(2000),
});

export const ApplicationIdSchema = z.object({
  id: z.number().int().positive(),
});
