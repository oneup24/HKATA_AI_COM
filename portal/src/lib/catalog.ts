export const LEVELS = ["kindergarten", "primary", "secondary"] as const;
export type Level = (typeof LEVELS)[number];

export const SCHOOL_CATEGORIES = [
  "kindergarten",
  "primary",
  "secondary",
  "special",
] as const;
export type SchoolCategory = (typeof SCHOOL_CATEGORIES)[number];

export const TRACKS = ["logo", "speech", "engineering"] as const;
export type Track = (typeof TRACKS)[number];

export const STATUSES = [
  "submitted",
  "reviewing",
  "approved",
  "waitlisted",
  "rejected",
] as const;
export type Status = (typeof STATUSES)[number];

export const PRIMARY_KITS = ["cubesat-1u", "robot-arm", "plant-pod"] as const;
export const SECONDARY_KITS = ["cubesat-3u", "mars-rover", "3d-rocket"] as const;
export const ALL_KITS = [...PRIMARY_KITS, ...SECONDARY_KITS] as const;
export type KitId = (typeof ALL_KITS)[number];

export const BRIEFING_SESSIONS = [
  "sec-session-1",
  "sec-session-2",
  "pri-session-1",
  "pri-session-2",
] as const;
export type BriefingSession = (typeof BRIEFING_SESSIONS)[number];

export const DISTRICTS = [
  "central_western",
  "wan_chai",
  "eastern",
  "southern",
  "yau_tsim_mong",
  "sham_shui_po",
  "kowloon_city",
  "wong_tai_sin",
  "kwun_tong",
  "kwai_tsing",
  "tsuen_wan",
  "tuen_mun",
  "yuen_long",
  "north",
  "tai_po",
  "sha_tin",
  "sai_kung",
  "islands",
] as const;
export type District = (typeof DISTRICTS)[number];

export const TEACHER_TITLES = [
  "stem_coordinator",
  "science_head",
  "primary_science",
  "physics",
  "ict",
  "bio_chem",
  "general_studies",
  "it_coordinator",
  "extracurricular",
  "other",
] as const;
export type TeacherTitle = (typeof TEACHER_TITLES)[number];

export const LEVEL_LABEL: Record<Level, string> = {
  kindergarten: "幼兒組",
  primary: "小學組",
  secondary: "中學組",
};

export const LEVEL_SUB: Record<Level, string> = {
  kindergarten: "KINDERGARTEN",
  primary: "PRIMARY (P1–P6)",
  secondary: "SECONDARY (S1–S6)",
};

export const CATEGORY_LABEL: Record<SchoolCategory, string> = {
  kindergarten: "幼稚園 (Kindergarten)",
  primary: "小學 (Primary School)",
  secondary: "中學 (Secondary School)",
  special: "特殊學校 / 其他教育機構",
};

export const DISTRICT_GROUPS: { label: string; options: District[] }[] = [
  {
    label: "港島 Hong Kong Island",
    options: ["central_western", "wan_chai", "eastern", "southern"],
  },
  {
    label: "九龍 Kowloon",
    options: [
      "yau_tsim_mong",
      "sham_shui_po",
      "kowloon_city",
      "wong_tai_sin",
      "kwun_tong",
    ],
  },
  {
    label: "新界 New Territories",
    options: [
      "kwai_tsing",
      "tsuen_wan",
      "tuen_mun",
      "yuen_long",
      "north",
      "tai_po",
      "sha_tin",
      "sai_kung",
    ],
  },
  { label: "離島 Islands", options: ["islands"] },
];

export const DISTRICT_LABEL: Record<District, string> = {
  central_western: "中西區 (Central & Western)",
  wan_chai: "灣仔區 (Wan Chai)",
  eastern: "東區 (Eastern)",
  southern: "南區 (Southern)",
  yau_tsim_mong: "油尖旺區 (Yau Tsim Mong)",
  sham_shui_po: "深水埗區 (Sham Shui Po)",
  kowloon_city: "九龍城區 (Kowloon City)",
  wong_tai_sin: "黃大仙區 (Wong Tai Sin)",
  kwun_tong: "觀塘區 (Kwun Tong)",
  kwai_tsing: "葵青區 (Kwai Tsing)",
  tsuen_wan: "荃灣區 (Tsuen Wan)",
  tuen_mun: "屯門區 (Tuen Mun)",
  yuen_long: "元朗區 (Yuen Long)",
  north: "北區 (North)",
  tai_po: "大埔區 (Tai Po)",
  sha_tin: "沙田區 (Sha Tin)",
  sai_kung: "西貢區 (Sai Kung)",
  islands: "離島區 (Islands)",
};

export const TITLE_LABEL: Record<TeacherTitle, string> = {
  stem_coordinator: "STEM / STEAM 主任 / 統籌員",
  science_head: "科學科主任 / 教師",
  primary_science: "小學科學科教師",
  physics: "物理科教師",
  ict: "資訊科技 (ICT) 主任 / 教師",
  bio_chem: "生物 / 化學科教師",
  general_studies: "常識科主任 / 教師",
  it_coordinator: "創新科技 / 資訊科技統籌員",
  extracurricular: "課外活動 / 競賽組主任",
  other: "其他教職員",
};

export const TRACK_META: Record<
  Track,
  { title: Record<Level, string>; caption: Record<Level, string> }
> = {
  logo: {
    title: {
      kindergarten: "太空任務標誌設計 + 太空基地填色",
      primary: "太空任務標誌設計",
      secondary: "太空任務標誌設計",
    },
    caption: {
      kindergarten: "TRACK 01 · 全港學校 · 毋須編程",
      primary: "TRACK 01 · 全校 · 毋須編程",
      secondary: "TRACK 01 · 全校 · 毋須編程",
    },
  },
  speech: {
    title: {
      kindergarten: "中國航天發展演講比賽",
      primary: "中國航天發展演講比賽",
      secondary: "中國航天發展演講比賽",
    },
    caption: {
      kindergarten: "",
      primary: "TRACK 02 · 初小 P1–P3 · 不超 3 分鐘演說",
      secondary: "",
    },
  },
  engineering: {
    title: {
      kindergarten: "航天 AI 工程挑戰",
      primary: "航天 AI 工程挑戰 · 未來月球基地",
      secondary: "航天 AI 工程挑戰 · 未來火星基地",
    },
    caption: {
      kindergarten: "",
      primary: "TRACK 03 · 高小 P4–P6 · 配備硬件",
      secondary: "TRACK 02 · 全校 · 配備硬件",
    },
  },
};

export const TRACK_LABEL: Record<Track, string> = {
  logo: "標誌設計",
  speech: "演講比賽",
  engineering: "工程挑戰",
};

export const TRACKS_FOR_LEVEL: Record<Level, Track[]> = {
  kindergarten: ["logo"],
  primary: ["logo", "speech", "engineering"],
  secondary: ["logo", "engineering"],
};

export const KIT_LABEL: Record<KitId, string> = {
  "cubesat-1u": "1U 立方衛星",
  "robot-arm": "太空AI機械人",
  "plant-pod": "太空種植智能舫艙",
  "cubesat-3u": "3U 立方衛星",
  "mars-rover": "智能火星探測車",
  "3d-rocket": "智能火箭模型",
};

export const KITS_FOR_LEVEL: Record<Level, readonly KitId[]> = {
  kindergarten: [],
  primary: PRIMARY_KITS,
  secondary: SECONDARY_KITS,
};

export const BRIEFING_META: Record<
  BriefingSession,
  { date: string; note: string; time: string; venue: string; level: Level }
> = {
  "sec-session-1": {
    level: "secondary",
    date: "2026 年 10 月 2 日",
    note: "（請於 2026 年 10 月 1 日或之前報名）",
    time: "下午 3 時至 4 時 30 分",
    venue: "香港航天科技教育學院（北角電氣道 228 號 1 樓）",
  },
  "sec-session-2": {
    level: "secondary",
    date: "2026 年 10 月 7 日",
    note: "（2026 年 10 月 6 日之後報名只設線上）",
    time: "下午 3 時至 4 時 30 分",
    venue: "九龍真光中學（九龍塘沙福道真光里 1 號）",
  },
  "pri-session-1": {
    level: "primary",
    date: "2026 年 10 月 8 日",
    note: "（建議 1-2位校方代表出席）",
    time: "下午 3 時至 4 時 30 分",
    venue: "長沙灣天主教小學（九龍長沙灣東京街 7 號）",
  },
  "pri-session-2": {
    level: "primary",
    date: "2026 年 10 月 9 日",
    note: "（建議 1-2位校方代表出席）",
    time: "下午 3 時至 4 時 30 分",
    venue: "長沙灣天主教小學（九龍長沙灣東京街 7 號）",
  },
};

export const STATUS_LABEL: Record<Status, string> = {
  submitted: "已提交",
  reviewing: "審核中",
  approved: "已核准",
  waitlisted: "候補",
  rejected: "不獲接納",
};

export const SITE_ORIGIN = "https://www.hkstarcatcher.com";
