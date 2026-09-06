# HKATA Website Revamp Plan V2 — "Official Space" Direction

> **For:** Kilo Code (implementation) · **Author:** planning pass · **Date:** 2026-09-06
> **Supersedes:** `.kilo/plans/REDESIGN_PLAN.md` (that plan's IA is already built into `index.html`; this plan changes the *visual tone* and *unifies the whole site*).

---

## ⚙️ Working Agreement — READ FIRST (for Kilo)

This doc is the **single source of truth**. Keep it in sync with reality or it becomes useless.

**Status legend:** `⬜ TODO` · `🔄 DOING` · `✅ DONE` · `⛔ BLOCKED` (needs user/planner) · `➖ N/A`

---

### 🟦 Every session — do this first

1. Read this plan top to bottom before touching any file.
2. Check the Task Board for `⬜ TODO` and `🔄 DOING` rows. Resume any `🔄 DOING` first, then work top-to-bottom by ID.
3. **Scroll to the bottom of this document** — the planner appends new task specs there with a `## 📥 Added YYYY-MM-DD` timestamp header. New instructions always appear at the bottom, not in the middle of the doc.

---

### ▶️ Before starting each task

1. Mark it `🔄 DOING` in the Task Board — before any file edit.
2. Read the spec section (the `§` column) in full.
3. Read the current state of the file you are about to edit. Never overwrite without reading first.
4. **One task at a time.** Complete and log it before starting the next. No silent batching.

---

### ✅ After finishing each task

1. Flip status to `✅ DONE` in the Task Board.
2. Append one Worklog line (bottom of file): `date · task ID · what changed · files touched`.
3. If you deviated from spec — note it with `⚠️` + one-line reason in both the Notes column and the Worklog.

---

### ⛔ If blocked

1. Mark the task `⛔ BLOCKED` immediately.
2. Write the specific blocker in the Notes column (what is missing, who needs to act).
3. Tell the user. Do not skip to another task or invent a workaround silently.

---

### 📥 Out-of-band work (user asked directly, no task ID)

1. Create a new Task Board row (next available ID).
2. Do the work.
3. Append a Worklog line. **Never do work silently.**

---

### 🚧 Scope boundary

- Only edit files mentioned in the current task's spec. No "while I'm here" edits to other files.
- Do not add features beyond the spec. If you think something extra would be good, log it as a suggestion in Notes — do not implement unasked.

## 📋 Task Board

> Update the **Status** cell as you go. `§` = the detailed spec section in this doc.

| ID | Task | Spec | Status | Notes |
|---|---|---|---|---|
| T1 | Shared token layer (`assets/theme.css`, CSS vars) — one source of truth | §2, §6 | ✅ DONE | `assets/theme.css` created; Option A (no build) |
| T2 | Color palette → "Official Space" (kill neon) across all pages | §2.1 | ✅ DONE | `cyanNeon`/`blueNeon`/`purpleNeon` retired; new tokens applied to all 5 pages |
| T3 | Typography (Space Grotesk / Noto Sans TC / Noto Serif TC) | §2.2 | ✅ DONE | Noto Sans TC + Space Grotesk + Noto Serif TC + IBM Plex Sans (free fallback) loaded on all pages; Orbitron retired |
| T4 | Motion & texture dial-down | §2.3 | ✅ DONE | Starfield canvas removed from all pages; aurora gradient background in `body`; `prefers-reduced-motion` respected |
| T5 | Header treatment (officialness) | §2.4 | ✅ DONE | ⚠️ User removed the top utility strip (per request). Main header kept with white nav links, gold-ringed LOGO 1.png, all nav-link → segment-page jumps |
| T6 | Bug & inconsistency fixes | §3 | ✅ DONE | Real secretariat contact (marketing@hkata.space / 6113 0828); N.O.R.A. → "即將推出" with email notify; placeholders removed; meta tags (OG, twitter, canonical) + favicon (logo.png + doc/img/LOGO 1.png) on all pages |
| T7 | Content / copy overhaul | §4 | ✅ DONE | 3 prospectus pages re-written; apply form fields; deadlines split into 報名截止 2026/10/31 + 提交作品 2027/3/31 |
| T8 | Build `kindergarten.html` prospectus | §1.5 | ✅ DONE | Full template per §1.5 (breadcrumb, header band, Track 01 標誌+填色, key dates, 報名 CTA → `apply.html?level=kindergarten`) |
| T9 | Build `primary.html` prospectus | §1.5 | ✅ DONE | ⚠️ Per user request: removed "+ 太空基地填色" from Track 01 title (logo-only for P/S). Track 02 演講 + Track 03 AI 工程 present |
| T10 | Build `secondary.html` prospectus | §1.5 | ✅ DONE | ⚠️ Same as T9: Track 01 logo-only. Track 02 = AI 工程 (no 初中/高中 split) |
| T11 | Homepage 3 segment cards → prospectus pages | §1.5 | ✅ DONE | 3 cards now point to `kindergarten.html` / `primary.html` / `secondary.html`; bug "both → track01.html" fixed |
| T12 | Migrate/park old `track0N.html` | §1.5 | ✅ DONE | track01/03/04 = redirect stubs; track02 = "未於首頁推廣" page; canonical + meta refresh |
| T13 | Apply: reframe contact → 初步建議負責人 | §5.1 A | ✅ DONE | Heading "初步建議負責人" + microcopy; teacherName → 負責人姓名; teacherEmail → 負責人電郵 (接收大賽通告); teacherPhone → 負責人 WhatsApp |
| T14 | Apply: 職銜/職位 → dropdown (10 roles) | §5.1 B | ✅ DONE | All 10 roles per spec; teacherTitle select with disabled placeholder; teacherTitleOther reveal on "other" |
| T15 | Apply: remove Steps 2–4 → single-step | §5.1 C | ✅ DONE | All step-content-2/3/4 deleted; step indicator + prev/next/save buttons removed; single "提交學校報名" submit |
| T16 | Apply: intro copy rewrite | §5.1 C-copy | ✅ DONE | ⚠️ User overrode the §5.1 C-copy wording. Final: "提交後秘書處將於 11月下旬官宣抽籤分組結果及通知校方領取官方「官方硬件套件」。" + "請由校長、副校長、STEM 主任或負責帶隊教師填寫。" removed per request. Deadline line "2026 年 10 月 31 日 23:59" kept |
| T17 | Apply: `?level=` segment consistency | §5.1 D | ✅ DONE | URLSearchParams pre-selects schoolCategory + segment radio + showTrackBlock(level); referrerLevel hidden field records the source prospectus |
| T18 | `#overview` 比賽目標 redesign | §5.2 | ✅ DONE | ⚠️ Per user request: removed 6-goals block entirely (Change 3) and stat-tile section (Change 4) + utility strip. Kept: 4 features with unified azure icon palette (Change 1+2), stat tiles relocated to standalone "預計規模 · At Scale" band |
| T19 | Submission backend → Google Sheets | §5.3 | ⛔ BLOCKED | Needs user to: (1) create the Google Sheet with `Registrations` tab, (2) paste the Apps Script, (3) deploy as Web App, (4) hand back the `/exec` URL. Kilo will wire `fetch()` once URL is provided. localStorage save + confirmation screen already in `submitRegistration()` |
| T20 | Hero banner on all 3 prospectus pages | §5.4 Enh. 1 | ✅ DONE | kindergarten + primary + secondary all rebuilt with `pt-40 pb-16 bg-[var(--surface-800)]`, breadcrumb, mission tagline (太空想像/未來月球/火星移民), descriptor line, 2 CTAs, dual aurora gradient |
| T21 | Hardware kit showcase block (primary + secondary) | §5.4 Enh. 2 | ✅ DONE | primary: 3 kits (CubeSat/E28/太空種植); secondary: 4 kits (CubeSat/Rover/3D火箭/智能機械手); aspect-video placeholders with `<!-- REPLACE: [kit].jpg -->` markers |
| T22 | Track order resequence on primary.html (AI工程 before 演講) | §5.4 Enh. 3 | ✅ DONE | New order: TRACK 01 標誌 → TRACK 02 AI工程 → TRACK 03 演講; alternating section-y / surface-alt preserved |
| T23 | In-page anchor nav (primary + secondary) | §5.4 Enh. 4 | ✅ DONE | sticky `top-20 z-30` nav with `本頁內容` + anchor pills; primary: logo/ai/speech/key-dates; secondary: logo/ai/key-dates. Matched id attributes added to each track section. |
| T24 | "一校多賽道" callout (primary + secondary) | §5.4 Enh. 5 | ✅ DONE | `card p-5 sm:p-6 border-l-4 border-[var(--primary-500)]` info callout with fa-circle-info icon + 2 lines of copy. Inserted between hero and first track. |
| T25 | Hardware lottery flow steps (primary + secondary) | §5.4 Enh. 6 | ✅ DONE | 4-step grid (報名 → 核實 → 抽籤 → 領取) below the hardware showcase, primary-300 numbers, 2-col mobile / 4-col desktop. |
| T26 | Fix double top-padding gap on all 3 prospectus pages | §5.4 Enh. 1 bug | ✅ DONE | Original T26 prescribed "move breadcrumb <nav> inside hero section". Resolved by a stronger fix: removed the HTML breadcrumb entirely (c590789) since the breadcrumb is now baked into the banner image. Also reduced image height 540→420 (6f90cd9) and pb-10→pb-6 to keep the layout tight. No more stacked-padding gap. |

> **No outstanding work in Kilo's queue.** T19 only unblocks with the user's Sheet + Web App URL. T20–T25 done, T26 (bug fix) also done.

---

## 0. Brief (what the user asked for)

Four goals, one tone shift:

1. **Fresh visual redesign** — move away from the neon / sci-fi "gamey" look.
2. **Unify sub-pages** — `apply.html` + `track01–04.html` must share ONE design system with `index.html`.
3. **Fix bugs & inconsistencies** — track link/naming mismatch, placeholders, missing meta.
4. **Content / copy overhaul** — tighten messaging, remove dead ends.

**Tone target (verbatim):** *"simple space color tone but official 正經 website."*
This is a **government-endorsed event** (教育局「心繫家國」· 香港回歸30周年). The site must read as **authoritative, trustworthy, institutional** — restrained space palette, generous whitespace, serious typography. Keep space DNA; drop the arcade glow.

---

## 0.1 CONFIRMED decisions (from user, 2026-09-06)

- **Secretariat email:** `marketing@hkata.space` · **Phone:** `61130828` (Hong Kong).
- **N.O.R.A. app is NOT live yet** → render **"即將推出"** state with an email-notify capture, **not** live App Store / Google Play links.
- **Site architecture changes to segment-based** (see §1.5) — this is now the single biggest structural change in the revamp.

---

## 1.5 NEW Site Architecture — segment-based (學段導向) ⭐

**Mental model:** a teacher lands on the homepage, picks *their school level* (幼兒 / 小學 / 中學), lands on **one complete prospectus page (比賽章程)** that lists **every 賽道 that level can enter**, then registers. No more "track" pages.

```
HOMEPAGE (index.html)
  └─ 3 segment cards: 幼兒 · 小學 · 中學
        │
        ├─ 幼兒比賽章程  (kindergarten.html)  ── 全部幼兒可參加賽道 ──▶ 報名
        ├─ 小學比賽章程  (primary.html)       ── 全部小學可參加賽道 ──▶ 報名
        └─ 中學比賽章程  (secondary.html)     ── 全部中學可參加賽道 ──▶ 報名
```

### Why this is the right call
- **Matches the user's real journey** — teachers/parents self-identify by level, not by abstract "Track 01/02/03".
- **Kills the current bug** where 小學組 and 中學組 both linked to `track01.html`. Each homepage card now has exactly ONE clear destination.
- **Each 章程 is self-contained** — a teacher sees everything relevant on one page and can print/share it.

### Which 賽道 lives on which prospectus (from the pathway matrix)
| Prospectus page | 賽道 included |
|---|---|
| **幼兒章程** `kindergarten.html` | 太空任務標誌設計 + 太空基地填色 (毋須編程) |
| **小學章程** `primary.html` | ① 標誌設計/填色（全級）· ② 中國航天發展演講（初小 P1–P3）· ③ 航天 AI 工程挑戰（高小 P4–P6：CubeSat / E28 / 太空種植） |
| **中學章程** `secondary.html` | ① 標誌設計/填色（全級）· ② 航天 AI 工程挑戰（初中：CubeSat / Rover / 3D 火箭；高中：Rover / 智能機械手） |

### Recommended prospectus page template (identical on all 3)
1. **Breadcrumb** 首頁 › 小學比賽章程 + a sticky in-page 報名 button.
2. **Header band** — level name, eligible 年級, one-line purpose, a **"下載章程 PDF"** button (teachers love a printable prospectus — strong recommend for an official/school audience).
3. **賽道 sections** — one block per track available to this level: 任務簡介 · 對象年級 · 提交作品 · 評審重點 · (hardware note where relevant, linking deeper only if needed).
4. **Timeline reminder** (compact, reuse homepage tokens) + key deadlines.
5. **Judging summary** (rubric, anonymized panel — reuse homepage component).
6. **Big 報名 CTA** → `apply.html?level=primary` (pre-selects segment + shows only that level's tracks).

### Registration flow — recommendation
Keep **ONE `apply.html`** that reads a `?level=kindergarten|primary|secondary` query param to (a) pre-select the segment and (b) show only that level's track options. One form to maintain, consistent validation, and each prospectus deep-links into it. (Alternative — 3 separate apply pages — triples maintenance; not recommended.)

### Migration of the existing track pages
- The current `track01/03/04.html` content is **reorganized by level** into the 3 new prospectus pages (a 賽道 like 標誌設計 appears on all three — see caution below).
- Recommend **new semantic filenames** (`kindergarten.html`, `primary.html`, `secondary.html`) for clarity + SEO; add redirects/links from any old `trackNN.html` if they were shared externally.
- `track02.html` (Blueprint) stays **parked/unlinked** per prior scope.

> **Maintenance caution:** the 標誌設計/填色 賽道 repeats across all 3 prospectus pages. With no build step this becomes 3 copies that can drift. Mitigation: keep that block's copy in ONE place in the plan/source and paste identically, OR (Option B build) use an HTML include/partial. Flag for the user.

---

## 1. Current-state audit (why we're doing this)

| Area | Current state | Problem |
|---|---|---|
| Design tokens | Each of the 6 HTML files declares its **own** inline `tailwind.config` | `purpleNeon` = `#A855F7` (index) vs `#7F00FF` (apply, track03); gold/amber differ. No single source of truth. |
| Visual language | Neon cyan/purple, glowing box-shadows, animated starfield canvas, `Orbitron` display font | Reads as sci-fi game, not an official government-endorsed academy. |
| Typography | `Inter` + `Orbitron`; **no dedicated Chinese webfont** | Traditional Chinese falls back to system fonts → inconsistent, un-official rendering across devices. |
| Track links | Homepage labels "Track 01/02/03" do **not** match filenames | `track01.html` = AI Engineering, `track03.html` = Logo, `track04.html` = Speech. Hero 小學組 **and** 中學組 both point to `track01.html`. Confusing/incorrect. |
| Placeholders | `secretariat@hkata.example`, non-functional App Store / Google Play `<button>`s, dashed "策略夥伴" slots | Ships broken/fake links on an official site. |
| Meta / share | No OpenGraph, no Twitter card, no favicon, no canonical | Bad link previews for the press & schools; no browser tab icon. |
| CDN dependency | `cdn.tailwindcss.com` (JIT in browser) on every page | Fine for prototype; flags a console warning + FOUC. Note for later, not blocking. |

---

## 2. New design system — "Official Space"

The heart of the revamp. **Create ONE shared token layer and reuse it on all 6 pages.** Kilo Code should decide implementation mechanism (see §6), but the *values* below are the contract.

### 2.1 Color palette (replaces the neon set)

Move from near-black + neon → **deep institutional navy + one confident azure + prestige gold**.

```
/* SURFACES — deep navy, not pure black; calmer, more "official" */
--surface-900: #0A1224;   /* page background (was #060913) */
--surface-800: #0F1A30;   /* section alt background */
--surface-700: #16233F;   /* card surface (replaces glass blur) */
--surface-600: #1E2E4D;   /* raised / hover surface */
--border:      rgba(255,255,255,0.10);
--border-soft: rgba(255,255,255,0.06);

/* PRIMARY — confident azure (authority + sky/space), NOT neon cyan */
--primary-500: #2E6FE0;   /* primary actions, links, active nav */
--primary-400: #4C8DF5;   /* hover */
--primary-300: #8FB6FA;   /* subtle accents on dark */

/* PRESTIGE — restrained gold for anniversary / national gravitas */
--gold-500:    #C7A24C;   /* "30週年", awards, official seals */
--gold-300:    #E3C983;

/* TEXT */
--text-hi:     #EAF0FA;   /* headings */
--text-body:   #B7C2D4;   /* body */
--text-mute:   #7C8AA3;   /* captions, eyebrows */

/* GROUP ACCENTS — desaturated (no glow). Used ONLY as thin identifiers. */
--group-k:     #3FA6A0;   /* Kindergarten — muted teal (was neon cyan) */
--group-p:     #3B7BD1;   /* Primary — azure */
--group-s:     #6B63C4;   /* Secondary — muted indigo (was neon purple) */

/* STATUS (timeline) */
--ok:     #3E9C74;  --active: #2E6FE0;  --soon: #6B7890;  --milestone: #C7A24C;
```

**Rules:**
- **Delete all `shadow-glow-*` box-shadows.** Replace with flat elevation: `0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)`.
- **Retire `glass-panel` heavy blur.** Cards become solid `--surface-700` with a `1px --border` edge. (Optional: keep a *very* light `backdrop-blur-sm` only on the sticky header.)
- Gold is **accent only** — anniversary badge, award tiles, official seal row. Never body text.
- Group accent colors are **1–3px identifiers** (left border, small icon chip), never large fills or glows.

### 2.2 Typography

| Role | Current | New | Why |
|---|---|---|---|
| Display / headings (Latin) | Orbitron | **Space Grotesk** (or `Sora`) — geometric but serious | Keeps a subtle "space" feel without arcade vibes. |
| Chinese headings & body | system fallback | **Noto Sans TC** (add weights 400/500/700/900) | Proper, consistent, official Traditional-Chinese rendering. **This is the single biggest "official" upgrade.** |
| Body (Latin) | Inter | **Inter** (keep) | Neutral, legible. |
| Optional gravitas | — | **Noto Serif TC** for the H1 anniversary line only | Adds ceremonial weight; use sparingly. |

- Drop Orbitron everywhere (`font-tech` → map to Space Grotesk).
- Set `font-family` stack so Chinese always resolves to Noto Sans TC before system fonts.
- Establish a type scale (suggest): H1 40/48, H2 30/28, H3 20, body 16, caption 13, eyebrow 11 uppercase tracked.

### 2.3 Motion & texture (dial WAY down)

- **Remove the animated starfield canvas.** Replace with a static, very subtle radial gradient + optional faint fixed star texture at ≤ 8% opacity. Serious sites don't twinkle.
- Keep: countdown, `.ics` toast, mobile menu, sticky CTA, scroll nav solidify.
- Transitions: 150–200ms ease on hover/elevation only. No scale-pop, no rotating icons, no particle bursts.
- Honor `prefers-reduced-motion` (already partially done — keep).

### 2.4 Header treatment (adds officialness)

- Add a **thin top utility strip** above the main nav: left = "教育局「心繫家國」聯校活動 · 慶祝香港回歸30周年", right = language note / secretariat link. Muted `--surface-800`, `--text-mute`, 32px tall. This single strip communicates government endorsement instantly.
- Main nav: solid `--surface-900/90` with `--border-soft` bottom; active link uses `--primary-500` + `aria-current`.

---

## 3. Bug & inconsistency fixes (do these regardless of visuals)

1. **Track links → segment links (SUPERSEDED by §1.5).** The 3 homepage cards now point to the 3 prospectus pages, one clean destination each:
   - 幼稚園組 → `kindergarten.html`
   - 小學組 → `primary.html`
   - 中學組 → `secondary.html`
   This dissolves the old "both cards → track01.html" bug entirely. The "三大賽事組別" directory becomes a "三大學段 / 比賽章程" directory (or is merged into the hero cards). `track02.html` (Blueprint) stays parked/unlinked.
2. **Replace placeholders (values now CONFIRMED):**
   - `secretariat@hkata.example` → **`marketing@hkata.space`**; add phone **`61130828`** in footer/contact.
   - App Store / Google Play `<button>`s → **app not live**: replace with a **"即將推出"** badge + a short email-notify capture (single field → `marketing@hkata.space` or a form). No dead store buttons.
   - 策略夥伴 dashed slots → real partner logos, or hide the sub-section until assets are provided (ASK).
3. **Add meta/SEO/share to every page:** `<meta og:*>`, `twitter:card`, `canonical`, and a favicon (derive from `doc/img/LOGO 1.png`). Rename `LOGO 1.png` → `logo.png` (space in filename is fragile in URLs).
4. **Consistent countdown deadline** across pages (2026-10-31 23:59 HKT) — verify apply.html matches.

---

## 4. Content / copy overhaul

- **Tone:** shift microcopy from playful ("揾到最適合你…") to composed but warm official register. Keep Traditional Chinese primary; keep short English sub-labels on group cards for press/overseas schools.
- **Hero:** keep the anniversary eyebrow + H1. Consider setting the "香港回歸30周年 · 教育局「心繫家國」" line in the top utility strip AND as an eyebrow badge for reinforcement.
- **Tracks directory:** ensure the 3 summaries are high-level only (no hardware deep-dive — that lives in `track01.html`). One-sentence hardware teaser + single link is correct; keep it.
- **Judging:** anonymized panel + rubric donut is good and on-brief — recolor donut to the new palette (azure/gold/teal/indigo family, no neon).
- **Awards / Organizers:** keep structure; restyle to new tokens.
- **Ecosystem (N.O.R.A. app):** app is **not live** — reframe as "即將推出 / Coming soon" with an email-notify field; remove functional store buttons; keep the 4 value-prop bullets and mockup as a preview.
- **Footer:** add real secretariat contact, privacy/terms stubs if required for an official site, and the organizer seal row.

---

## 5. Per-file work list

| File | Work |
|---|---|
| `index.html` | Re-skin to new tokens; remove starfield; add top utility strip; recolor donut/timeline/cards; **repoint hero cards to the 3 prospectus pages**; N.O.R.A. → "即將推出"; real contact; add meta+favicon. |
| `kindergarten.html` **(NEW)** | 幼兒比賽章程 — build from prospectus template (§1.5); source content from `track03.html` (Logo/Colouring). |
| `primary.html` **(NEW)** | 小學比賽章程 — Logo/填色 + 演講(初小, from `track04.html`) + AI 工程(高小, from `track01.html` subset). |
| `secondary.html` **(NEW)** | 中學比賽章程 — Logo/填色 + AI 工程(初中/高中, from `track01.html`, full hardware). |
| `apply.html` | Adopt shared tokens (currently `#7F00FF` etc.); re-skin form to official style; **read `?level=` param** to pre-select segment + relevant tracks; verify deadline; meta+favicon. Visible labels + `--primary-500` focus states. |
| `track01/03/04.html` | Content migrated into the 3 prospectus pages. Then either **delete** or leave as thin redirects to the matching segment page (decide with user if links were shared externally). |
| `track02.html` | Blueprint — parked/unlinked; re-skin only if kept reachable. |
| **all** | Same header (with utility strip), same footer, same token layer, same fonts, meta tags, favicon, real contact (`marketing@hkata.space` / `61130828`). |

---

## 5.1 Apply page (`apply.html`) — form spec (from annotated mockup, 2026-09-06)

Changes to the **第一步：學校基本資料** block. Leave 學校中文/英文全稱, 學校類別, 所屬分區, 校舍通訊地址, 校長姓名/電郵 as-is (only re-skin to new tokens).

### A. Reframe the contact group as "初步建議負責人"
Add a sub-heading **「初步建議負責人」** above the current teacher fields, with helper microcopy:
> 此為貴校初步建議之帶隊負責人，秘書處核實後仍可更改。

Rationale: at registration the school may not have finalised who leads — the softer label lowers friction and sets expectations.

Relabel the three existing fields (IDs unchanged — `teacherName` / `teacherEmail` / `teacherPhone`):
| Field id | Old label | New label |
|---|---|---|
| `teacherName` | 帶隊統籌老師 / STEM 主任姓名 | **負責人姓名** |
| `teacherEmail` | 帶隊老師電郵 (接收大賽通告) | **負責人電郵** (接收大賽通告) |
| `teacherPhone` | 聯絡電話 / WhatsApp | **負責人 WhatsApp** |

### B. 職銜 / 職位 → dropdown (was free-text `#teacherTitle`)
Replace the `<input type="text" id="teacherTitle">` with a `<select id="teacherTitle" required>` using these options **verbatim** (value = English slug, visible text = the bilingual label shown):

| value | Label (繁中 + EN) |
|---|---|
| `stem_coordinator` | STEM / STEAM 主任 / 統籌員 (STEM / STEAM Coordinator) |
| `science_head` | 科學科主任 / 教師 (Science Department Head / Teacher) |
| `primary_science` | 小學科學科教師 (Primary Science Teacher) |
| `physics` | 物理科教師 (Physics Teacher) |
| `ict` | 資訊科技（ICT）主任 / 教師 (ICT Teacher) |
| `bio_chem` | 生物 / 化學科教師 (Biology / Chemistry Teacher) |
| `general_studies` | 常識科主任 / 教師 (General Studies Teacher — 適用於小學) |
| `it_coordinator` | 創新科技 / 資訊科技統籌員 (Innovation & Technology / IT Coordinator) |
| `extracurricular` | 課外活動 / 競賽組主任 (Extra-curricular / Competition Coordinator) |
| `other` | 其他教職員 (Other Teaching Staff) |

- First option: `<option value="" disabled selected>請選擇職銜 / 職位</option>`.
- **Recommend:** when `other` is selected, reveal a small free-text input (`#teacherTitleOther`) so no role is lost.
- **Optional enhancement:** filter the list by 學校類別 (e.g. hide 物理/生物/化學 for 幼稚園; surface 常識科/小學科學 for 小學). Nice-to-have, not required for launch.

### C. Remove Steps 2–4 → single-step registration ⭐ (user request, 2026-09-06)
Collapse the 4-step wizard to a **single-page school sign-up** (Step 1 only). Registration now captures *only* school + principal + proposed contact; track selection, team rosters, and declarations move to a later stage (after the secretariat verifies and issues the school code).

**Remove entirely:**
| Step | Section | id(s) to delete |
|---|---|---|
| 2 | 比賽組別及套件申領 (tracks + kit application) | `step-content-2`, `step-tab-2`, all `track1/2/3_enable` + kit/grade-quota controls |
| 3 | 參賽隊伍與導師名單 (team & mentor roster) | `step-content-3`, `step-tab-3`, the roster table |
| 4 | 學校 Space Logo 牌與聲明 (logo plate + declaration) | `step-content-4`, `step-tab-4` |

**Also remove / simplify the wizard scaffolding:**
- The step-indicator row (all 4 tabs) and the progress bar (`progress-bar-fill`) — no longer needed for one step. (Optionally keep a simple page title instead.)
- `nextBtn` / `prevBtn` / `saveBtn` step controls → replace with a single **提交學校報名** submit button shown immediately.
- JS: delete `changeStep`, `updateStepUI`, `validateCurrentStep` step logic, `toggleTrackDetails`, and any track/roster handlers. Keep only the field validation for the remaining Step-1 fields + submit.
- Preserve any "save & leave" behaviour only if it still makes sense for a single short form (likely drop it).

**Post-removal, verify:** no dangling JS references to deleted ids (would throw on load), submit still fires, and the confirmation/toast still works.

### C-copy. Intro copy rewrite (for Kilo — replaces the stale `apply.html` lines 109–112)
The old sub-paragraph promised immediate 領取「學校代碼」與研發材料套材, which is no longer accurate after Steps 2–4 were removed. Replace with:

- **Sub-paragraph** (`<p class="body ...">`):
  > 請由校長、副校長、STEM 主任或負責帶隊教師填寫本學校報名表。提交後，秘書處將於 3 個工作天內核實貴校資料並發出官方「HKATA 專屬學校代碼」；其後將另行通知比賽組別選擇及研發材料套材之領取安排。
- **Deadline line** (`<p class="caption ...">`):
  > 報名截止：**2026 年 10 月 31 日 23:59**（香港時間）

Rationale: registration is now a single-step *expression of interest*; the school code is issued first, and track/materials logistics are communicated separately later. Copy must match that flow.

### D. Consistency with the new segment architecture (§1.5)
- With Steps 2–4 gone, `apply.html` no longer contains a track-selection block. The `?level=kindergarten|primary|secondary` param now simply **pre-selects 學校類別** (and can set a hidden field recording which prospectus the user came from). The three prospectus pages still deep-link in with the param.
- Re-skin all `glass-input` fields to the new palette: solid `--surface-700`, `1px --border`, focus ring `--primary-500` (2px), placeholder in `--text-mute`. Remove neon focus glows. (Note: apply.html already partially uses the new `--surface/--primary` vars — finish the pass.)
- Keep the remaining field IDs stable so any existing submit handler / backend mapping still works.

---

## 5.2 `#overview` "比賽目標" section — redesign (for Kilo, 2026-09-06)

**Current state:** header → 2×2 特色 cards → flat 6-row numbered goals list → stat tiles. Three problems: (1) the 4 cards and 6 goals overlap in meaning (reads redundant), (2) the goals list is low-contrast flat rows — too weak for a flagship official event, (3) icon circles use 4 different accent colors (teal/azure/green/gold) → too "rainbow" for the 正經 tone.

**Redesign goals:** differentiate the two blocks, raise the objectives to real visual weight, unify the palette, elevate the 30th-anniversary point as the prestige note.

### Change 1 — Differentiate the two blocks with distinct labels
Give each block its own eyebrow so the reader knows cards = *features*, list = *objectives*:
- Above the 4 cards: eyebrow **「四大特色 · Why This Competition」** (keep the H2 "比賽目標" + sub as the section header above it).
- Above the goals: a divider + secondary heading **「六大目標 · Our Objectives」**.

### Change 2 — Unify the 4 card icons to one accent (institutional look)
Recolor all four card icon circles to the **azure primary** treatment: `bg-[rgba(46,111,224,0.10)]`, border `--primary-500`, icon `--primary-300`. Drop the per-card teal/green/gold icon colors. (One confident accent reads far more official than four.) Keep the cards otherwise as-is.

### Change 3 — Rebuild the flat goals list as a 2×3 numbered grid ⭐
Replace the full-width `space-y-3` row list with a responsive grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`. Each goal becomes a compact card:
- A large **ghost number** (01–06) — `font-display`, big, low-opacity outline/tint in `--primary-300` at ~25–30% — sitting behind or beside the text.
- The goal statement in `body` / `--text-body`.
- Card surface: `--surface-700`, `1px --border`, radius to match `.card`. Equal heights.
- **Goal 06 (30th anniversary) = prestige tile:** gold treatment — border `--gold-500`, number in `--gold-300`, add a small seal/flag icon (`fa-award` or similar). This is the one intentional color break, and it pulls the official/national-significance tone through.

Result: the objectives read as six deliberate, scannable commitments instead of fine print.

### Change 4 — Relocate the stat tiles (recommended, confirm)
The 約300 / 約1,000 / 約20,000 tiles answer *scale*, not *goals* — they dilute this section's focus. **Recommend** moving them to a slim standalone band directly under the hero (or as a thin divider strip between hero and overview). If the user prefers to keep them here, at minimum add a divider + small label 「預計規模」 so they read as a separate idea.

### Notes for Kilo
- Reuse existing tokens/classes (`.card`, `.eyebrow`, `.h2`, `.h3`, `.body`, `--surface-700`, `--primary-*`, `--gold-*`, `--border`). No new colors.
- Keep all copy verbatim (the 4 card texts + 6 goal texts already finalised).
- Maintain responsive behaviour: cards 1-col on mobile; goals 1/2/3-col at base/sm/lg.
- Honor `prefers-reduced-motion`; no glow shadows.

---

## 5.3 Submission backend — record registrations to Google Sheets ⭐

**Problem:** `apply.html`'s `submitRegistration()` (line ~910) only writes to the visitor's own `localStorage` (line ~945) + generates a client-side `appId`. **The data never reaches the secretariat.** Every submission is currently lost.

**Chosen solution: Google Apps Script Web App** (free, no server, works from static hosting). Alternatives considered: SheetDB/Sheety (row-capped free tier), Formspree/Basin (email+dashboard), native Google Form (zero-code but loses the custom UI). Apps Script wins on cost + control.

### Split of responsibilities
- **User does (needs a Google account — NOT Kilo):** create the Sheet, paste the Apps Script, deploy the Web App, hand the `/exec` URL back.
- **Kilo does:** wire the `fetch()` into `submitRegistration()`, add the consent checkbox + validation, keep the existing localStorage/confirmation UI.

### Sheet
Tab `Registrations`, header row:
`時間戳, 申請編號, 學校中文, 學校英文, 學校類別, 分區, 地址, 負責人, 職銜, 負責人電郵, 負責人電話, 校長, 校長電郵, 學段`

### Apps Script (`Code.gs`) — user pastes, sets `SHEET_ID`, deploys as Web App (Execute as: Me · Access: Anyone)
```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('Registrations');
    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(), d.appId, d.schoolNameCn, d.schoolNameEn, d.schoolCategory,
      d.schoolDistrict, d.schoolAddress, d.teacherName, d.teacherTitle,
      d.teacherEmail, d.teacherPhone, d.principalName, d.principalEmail, d.level
    ]);
    MailApp.sendEmail('marketing@hkata.space', '新學校報名：' + d.schoolNameCn,
      d.schoolNameCn + ' (' + d.appId + ') 已提交報名。');
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally { lock.releaseLock(); }
}
```

### Client wiring (Kilo) — inside `submitRegistration()`, after `formData` is built
```javascript
fetch('YOUR_WEB_APP_EXEC_URL', {
  method: 'POST',
  mode: 'no-cors',                                  // avoids CORS preflight setup
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(formData)
});
// keep existing localStorage save + confirmation screen; appId stays client-generated
```
- `no-cors` = response is opaque (can't be read) — fine, because `appId` is generated locally already.
- Ensure `formData` includes the `?level=` value (as `level`) and the `teacherTitle` dropdown value (§5.1 B).
- Recommend a lightweight failure fallback: wrap in try/catch and, if `fetch` throws, still show the confirmation but log/queue for retry (data also persists in localStorage).

### PII / compliance (official site — required)
- **Consent checkbox** before submit (HK PDPO), e.g.:
  > ☐ 本人已閱讀並同意大會秘書處收集及處理上述資料，作報名審核及聯絡用途。
  Block submit until checked.
- **Restrict Sheet sharing** to secretariat accounts only — it holds principal/teacher emails & phones.
- Consider a short privacy note / link in the footer of `apply.html`.

---

## 5.4 Prospectus page structural enhancements — all 3 pages (user request, 2026-09-06)

> **For Kilo:** apply to `kindergarten.html`, `primary.html`, `secondary.html`. The current pages have the right token/class usage — just extend the structure per the spec below. Keep the Working Agreement: flip the task board + append Worklog when done.

---

### Enhancement 1 — Hero banner (replaces bare header band)

**Goal:** each prospectus page opens with a full visual impact that matches the level's identity — not just a chip + H1.

**Structure (replace the current `<section class="section-y">` header band with this):**

```
[HERO SECTION — full-bleed, surface-800, min-height 56vh, flex column center]
  Breadcrumb (top-left, above the content)
  ──────────
  eyebrow chip  e.g. "KINDERGARTEN · 幼兒組"
  H1 (font-serif, large)  "幼兒比賽章程"
  Mission tagline (body-lg, italic)
    • kindergarten: "太空想像，從藝術起步"
    • primary:      "未來月球基地築夢計劃"
    • secondary:    "火星移民工程挑戰"
  Descriptor line (body, text-mute)  — eligible grades + track count
    e.g. "全港幼稚園 K1–K3 · 1 條賽道 · 毋須編程"
    e.g. "全港小學 P1–P6 · 3 條賽道"
    e.g. "全港中學 S1–S6 · 2 條賽道 · 含 7 款官方硬件套件"
  ──────────
  Two CTA buttons (row): "下載章程 PDF"（btn-ghost） · "立即報名"（btn-gold）
  ──────────
  [optional background] subtle radial gradient or star-dot texture — use the existing CSS aurora pattern or a low-opacity background image if available; DO NOT add a new JS particle system
```

**Token guidance:** `bg-[var(--surface-800)]`, apply `pt-40` (for fixed header) + `pb-16`. Text on hero: `--text-hi` for H1/tagline, `--text-body` for descriptor. Chip uses existing `chip chip-k / chip-p / chip-s` classes.

---

### Enhancement 2 — Hardware kit showcase block

**Goal:** teachers need to see *what hardware their students will work with* before registering. Blank image placeholder is fine now; real photos drop in later.

**Applies to:** `primary.html` (Track 03 AI工程) · `secondary.html` (Track 02 AI工程). `kindergarten.html` has no hardware — skip.

**Placement:** insert this block **immediately after the Track mission 簡介 card**, before the AI核心要求 / 提交作品 grid.

**Structure:**

```
[HARDWARE SHOWCASE — surface-alt band within the track section]
  Eyebrow: "官方硬件套件 Official Hardware Kits"
  Sub-copy: "每校於完成報名後，由大賽秘書處抽籤分配一款硬件套件。"

  Card grid (2 cols on mobile → 3 or 4 cols on desktop):
    Each card:
      [image box 16:9, bg-surface-700, rounded-xl]  ← blank placeholder; add `<!-- REPLACE: actual photo -->` comment
      Kit badge / chip (chip-s)  e.g. "CubeSat 微型衛星"
      1-sentence description (body-sm / caption)
      Grade eligibility tag (caption, text-mute)
```

**Kit data — use these exactly, one card per kit:**

| Kit name | Description (1 sentence) | Grade |
|---|---|---|
| 3U CubeSat 微型衛星 | 可升空的真實規格微型衛星，搭載感測器模組，任務：軌道資料採集與地面站通訊。 | 高小 P4–P6 · 初中 S1–S3 |
| E28 太空 AI 機械人 | 具視覺感知與自主移動能力的地面機器人，任務：月球基地自動巡邏與異常偵測。 | 高小 P4–P6 |
| 太空種植方艙 | 模擬太空密閉環境的智能種植箱，任務：以 AI 監控植物生長及環境調節。 | 高小 P4–P6 |
| 探測車 Rover | 六輪全地形遙控探測車，搭載攝像與感測器，任務：火星地形勘探與自動避障。 | 初中 S1–S3 · 高中 S4–S6 |
| 3D 打印火箭工程 | 以 3D 打印設計並測試火箭模型，任務：結構優化與推進力工程分析。 | 初中 S1–S3 |
| 智能機械手 | 六軸精密機械臂，搭載夾爪與感測器，任務：火星樣本採集與精準操控 AI。 | 高中 S4–S6 |

**Image placeholders:** use `<div class="aspect-video bg-[var(--surface-700)] rounded-xl flex items-center justify-center"><span class="caption text-[var(--text-mute)]">硬件圖片即將更新</span></div>`. Each card gets a `<!-- REPLACE: [kit-name].jpg -->` HTML comment so photos can be dropped in later.

---

### Enhancement 3 — Track order resequence (primary.html only)

**Current order:** Track 01 標誌設計 → Track 02 演講 → Track 03 AI工程
**New order:** Track 01 標誌設計 → Track 02 AI工程（升） → Track 03 演講（降）

**Rationale:** AI Engineering is the flagship competition; 演講 is narrower (P1–P3 only). Reordering signals priority to teachers scanning the page.

**Kilo action:** in `primary.html`, swap the section blocks — `<!-- TRACK 02: 中國航天演講 -->` and `<!-- TRACK 03: AI 工程 -->` — so AI工程 comes first. Update the section background alternation (`section-y` / `section-y surface-alt`) so they still alternate correctly. No content changes needed, just reorder.

**secondary.html:** only 2 tracks (標誌 + AI工程), order is already correct — no change needed.

---

### Enhancement 4 — In-page anchor nav (primary + secondary only)

**Goal:** a teacher on `primary.html` can jump straight to Track 03 AI工程 without scrolling past Track 01.

**Placement:** between the hero section and the first track section.

**Structure:**
```
[ANCHOR NAV — sticky or static, surface-900/70 backdrop, border-b border-soft]
  label: "本頁內容"  (caption, text-mute)
  |  anchor link to each track section on this page  |  anchor to 重要日子  |
  e.g. primary:    #track-logo · #track-ai · #track-speech · #key-dates
  e.g. secondary:  #track-logo · #track-ai · #key-dates
```

Add matching `id` attributes to each track `<section>`: `id="track-logo"`, `id="track-ai"`, `id="track-speech"`, `id="key-dates"`.

**kindergarten.html:** only 1 track — skip anchor nav; not needed.

---

### Enhancement 5 — "一校可同時報讀多條賽道" callout

**Placement:** inside the hero section, below the CTA buttons. Or as a small banner directly after the hero.

**Content:**
```
[info callout — card or inline strip, --primary-300 left border]
  icon: fa-circle-info
  "💡 一校可同時報讀多條賽道，各賽道分開評審。"
  "例如：小學可同時參加「標誌設計」及「AI 工程挑戰」，毋須重複報名。"
```

Apply to `primary.html` and `secondary.html`. For `kindergarten.html`, there is only 1 track — omit.

---

### Enhancement 6 — Hardware lottery flow (primary + secondary AI engineering track only)

**Goal:** kill the "怎樣拿到硬件？" phone call. A simple 4-step visual under the hardware kit showcase.

**Structure (4 step pills in a row, or 2×2 on mobile):**
```
Step 1: 完成學校報名  →  Step 2: 秘書處核實 (11月)  →  Step 3: 抽籤分配套件  →  Step 4: 領取套件 (2027年1月)
```
Use the existing numbered-step pattern from the plan or simple flex pills with `--primary-300` numbers.

---

### Task Board rows to add (Kilo — add these to the board above)

| ID | Task | Spec | Status |
|---|---|---|---|
| T20 | Hero banner on all 3 prospectus pages | §5.4 Enh. 1 | ⬜ TODO |
| T21 | Hardware kit showcase block (primary + secondary) | §5.4 Enh. 2 | ⬜ TODO |
| T22 | Track order resequence on primary.html (AI工程 before 演講) | §5.4 Enh. 3 | ⬜ TODO |
| T23 | In-page anchor nav (primary + secondary) | §5.4 Enh. 4 | ⬜ TODO |
| T24 | "一校多賽道" callout (primary + secondary) | §5.4 Enh. 5 | ⬜ TODO |
| T25 | Hardware lottery flow steps (primary + secondary) | §5.4 Enh. 6 | ⬜ TODO |

---

## 6. Implementation approach (recommendation for Kilo Code)

**Single source of truth for tokens.** Two viable mechanisms — pick one and apply to all 6 pages:

- **Option A (fastest, no build):** Create `assets/theme.css` with `:root { --… }` CSS variables + shared component classes (`.btn-primary`, `.card`, `.eyebrow`, `.section`, etc.). Each page keeps CDN Tailwind but *maps* the Tailwind config colors to the CSS vars and links `theme.css`. One file to change tokens.
- **Option B (cleaner, small build):** Introduce a minimal Tailwind build (CLI) with one `tailwind.config.js` + `input.css`, output a single `assets/app.css`, drop the per-page inline configs and the CDN script. Better performance, kills the CDN console warning. Slightly more setup.

Recommend **Option A now** (matches the current no-build, static-hosting setup and unblocks the visual work immediately), with Option B noted as a follow-up for production.

**Order of implementation (lowest risk first):**
1. Build the shared token layer (`assets/theme.css`) with the §2 palette + type + base component classes. Add Noto Sans TC / Space Grotesk font links.
2. Re-skin `index.html` end-to-end against the new tokens; remove starfield; add utility strip; recolor donut/timeline; repoint hero cards to the 3 prospectus pages; N.O.R.A. → 即將推出; real contact; meta+favicon. **This is the reference page.**
3. Build the **prospectus template** once, then produce `kindergarten.html` → `primary.html` → `secondary.html`, migrating content from the old track pages (§1.5).
4. Update `apply.html`: shared tokens + `?level=` pre-selection.
5. Retire/redirect `track01/03/04.html`; leave `track02.html` parked.
6. Copy pass (§4) across all pages.
7. QA: §7 checklist.

---

## 7. Acceptance / QA checklist

- [ ] All 6 pages share identical header (with utility strip), footer, fonts, and token values — no page redefines a color differently.
- [ ] Zero `shadow-glow-*` / neon usages remain; starfield canvas removed.
- [ ] Traditional Chinese renders in Noto Sans TC on Chrome + Safari.
- [ ] Every track link resolves to the correct page; no two hero cards point to the same wrong file.
- [ ] No `*.example` addresses or dead `<button>` store links ship.
- [ ] OG image + favicon present and correct on all pages; nice link preview.
- [ ] Contrast AA: body ≥ 4.5:1, large text ≥ 3:1 on `--surface-900`.
- [ ] Keyboard focus visible (`--primary-500`, 2px) on all interactive elements.
- [ ] `prefers-reduced-motion` disables remaining transitions.
- [ ] Mobile: sticky CTA, collapsible nav, no horizontal overflow.

---

## 8. Open questions for the user (please confirm before/at implementation)

**Resolved by user:** secretariat contact (`marketing@hkata.space` / `61130828`), N.O.R.A. app not live (→ 即將推出), site structure (segment-based, §1.5), homepage card destinations.

**Recommended defaults — APPLIED unless the user overrides.** Kilo Code should implement these as written:

1. **Filenames → semantic, with safety redirects.** Use `kindergarten.html` / `primary.html` / `secondary.html`. Keep `track01/03/04.html` as **thin redirect stubs** (a `<meta http-equiv="refresh">` + `<link rel="canonical">` + a one-line "頁面已遷移" link) pointing to the matching segment page, so any externally-shared old link still lands correctly. `track02.html` stays parked/unlinked.
2. **Strategic partner logos → hide for now.** Remove the dashed placeholder sub-section entirely (official sites shouldn't ship empty slots). **Keep** the co-organizer seal row (教育局 · 心繫家國 · SPSC · HKSSSC · HKATA — these are real). Re-add "策略夥伴" only when real assets arrive.
3. **Display font → Space Grotesk (Latin display) + Noto Sans TC (Chinese, all weights).** Reserve **Noto Serif TC for the single anniversary H1 line only** for ceremonial gravitas; everything else stays sans. Skip Sora.
4. **Stay no-build (Option A: `assets/theme.css`).** For the shared 標誌設計/填色 賽道 block that repeats on all 3 prospectus pages: keep the **canonical copy in this plan / a source snippet** and paste identically; add a `<!-- SHARED BLOCK: logo-track — keep in sync across kindergarten/primary/secondary -->` comment marker on each copy. Revisit a real build (Option B) post-launch.
5. **"下載章程 PDF" → wire the button now, coming-soon state.** PDFs don't exist yet; render the button but on click show the existing toast pattern ("章程 PDF 即將提供") so the layout is final and the real file drops in later with no re-layout.
6. **Top utility strip → endorsement line only.** No functional 繁/EN toggle now (full English translation is a separate, larger effort). Leave room in the strip layout so an "EN" link can be added later.

Anything above can be flipped by the user; the plan is internally consistent with these defaults.

---

## 9. Out of scope (unchanged from prior plan)

公眾投票 (Public Voting), 升空 / To-Space launch features, and 未來基地概念藍圖大賽 promotion are **not** surfaced on the homepage. `track02.html` remains reachable but unlinked from home.

---

## 📝 Worklog — append newest at the top (for Kilo)

> **Format:** `YYYY-MM-DD · <who> · <task ID> · <what changed> · <files>`
> One line per completed item. Out-of-band tasks (user asked directly) → also add the row to the Task Board. Deviations → prefix `⚠️` + reason.

| Date | Who | Task | What changed | Files |
|---|---|---|---|---|
| 2026-09-06 | Kilo | T1–T7, T11–T18 | Re-skin `index.html` + `apply.html` end-to-end per plan v2: new design tokens, Noto Sans TC + Space Grotesk, dark navy + azure + gold palette, 3 group CTA cards w/ Cartographic Cosmos banners, hero w/ "Cartographic Cosmos" banner image, 4-feature #overview (unified azure icons), pathway matrix, judging donut + paragraph panel, timeline w/ 09/16-10/31 active, N.O.R.A. coming-soon email capture, real secretariat contact, single-step apply form, 18 HK districts, XXXX placeholders, dropdown for 職銜, segment radios + per-segment tracks, consent checkbox, single submit. State saved as commit `87f6483`. | `assets/theme.css`, `index.html`, `apply.html`, `kindergarten.html`, `primary.html`, `secondary.html`, `track01–04.html`, `doc/img/hero-banner*.png`, `doc/img/group-{k,p,s}.png`, `logo.png`, `.kilo/{hero-philosophy.md,plans/*,render_hero.py,render_group_cards.py}` |
| 2026-09-06 | Kilo | T1.1 (new) | Generated Cartographic Cosmos hero banner (1920×720) + OG variant (1200×630) per the design philosophy in `.kilo/hero-philosophy.md`. | `.kilo/hero-philosophy.md`, `doc/img/hero-banner.png`, `doc/img/hero-banner-og.png` |
| 2026-09-06 | Kilo | T1.2 (new) | Generated 3 group card banner images (800×300 each) for kindergarten/primary/secondary cards. | `.kilo/render_group_cards.py`, `doc/img/group-k.png`, `doc/img/group-p.png`, `doc/img/group-s.png` |
| 2026-09-06 | Kilo | T7-chore | `.gitignore` for *.bak and .DS_Store; cleaned up accidental duplicates (group-*-1.png, hero-banner111.png, hero-banner-og111.png). | `.gitignore` |
| 2026-09-06 | User → Kilo | T5 ⚠️ | User asked to remove the top utility strip ("教育局「心繫家國」聯校活動 … 慶祝香港特區成立 30 週年") from all 5 pages. Strip + endpoints + nav spacing adjusted on all pages. | `index.html`, `apply.html`, `kindergarten.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | T6 (extension) | "no need" — removed audience switcher (家長/老師/學生) from hero. | `index.html` |
| 2026-09-06 | User → Kilo | T7 (extension) | Removed countdown block from hero per user request. | `index.html` |
| 2026-09-06 | User → Kilo | T7 (extension) | "公眾投票" all references removed across the site (kept out per plan §9 out-of-scope). | `index.html` |
| 2026-09-06 | User → Kilo | T7 (extension) | "升空" all references removed from copy (per plan §9 out-of-scope). | `index.html` |
| 2026-09-06 | User → Kilo | T7 (extension) | "未來基地概念藍圖大賽" all references removed from the page (per plan §9 out-of-scope). | `index.html` |
| 2026-09-06 | User → Kilo | T18 ⚠️ | "4大特色，6大目標" combined headline. Then "remove this part" removed the 6-goals block entirely. Stats relocated to standalone "預計規模" band. Goal 01–06 ghost numbers removed. | `index.html` |
| 2026-09-06 | User → Kilo | T18 (extension) | Removed "獎項" (Awards) section per user request. | `index.html` |
| 2026-09-06 | User → Kilo | T18 (extension) | Removed "Official Seal / 官方徽記" logo section per user request. | `index.html` |
| 2026-09-06 | User → Kilo | T7 (extension) | Moved 主辦機構 (Co-organizers) section from bottom of page to right under the hero / 3 group cards (per user "move, not remove" instruction). | `index.html` |
| 2026-09-06 | User → Kilo | T6 (extension) | Replaced "2017 年 3 月 31 日" hero deadline with two-line display: "報名截止日期 2026 年 10 月 31 日" (large gold) + "提交作品截止 2027 年 3 月 31 日" (small muted). | `index.html` |
| 2026-09-06 | User → Kilo | T6 (extension) | Timeline status update per "now is 9/16 section": 09/16–10/31 → 進行中, 11/16 + 01/11 → 即將開始 (previously shown as completed). | `index.html` |
| 2026-09-06 | User → Kilo | T7 (extension) | "在AT-A-GLANCE中刪除 30 週年 tile + 在數字前加 '約'" — now shows 約 300 / 約 1,000 / 約 20,000. | `index.html` |
| 2026-09-06 | User → Kilo | T16 | Final intro copy: "提交後秘書處將於 11月下旬官宣抽籤分組結果及通知校方領取官方「官方硬件套件」。" + removed "請由校長、副校長、STEM 主任或負責帶隊教師填寫。". | `apply.html` |
| 2026-09-06 | User → Kilo | T13 (extension) | Replaced all real-name placeholders (香港培正中學 / Pui Ching Middle School / 陳大文 / 張校長) with anonymized XXXX variants. | `apply.html` |
| 2026-09-06 | User → Kilo | T13 (extension) | School district dropdown changed from 4 regions to all 18 HK districts (港島 4 + 九龍 5 + 新界 8 + 離島 1) with bilingual labels and `<optgroup>` grouping. | `apply.html` |
| 2026-09-06 | User → Kilo | T18 (extension) | Removed "校長授權" (principal authorization) section from apply form. Added new "比賽選擇" (Competition Selection) section with 3 segment radios (幼兒/小學/中學) + per-segment track checklists. Removed "+ 太空基地填色" from Primary/Secondary Track 01 to align with apply form. | `apply.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | T5 (extension) | Header nav link color → white (`var(--text-hi)`) per user request. Header logo switched from `logo.png` to original `doc/img/LOGO 1.png` with `bg-white` background and gold ring (no `mix-blend-mode`). | `index.html`, `apply.html`, `kindergarten.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | T8–T10 (extension) — **UNDONE** | "move this section after 截止日期" was added then reverted in the same session; 3 group CTA cards were not actually wanted on the prospectus pages. | `kindergarten.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | T11 (extension) | "move the part up to above, after the hero section" — 三大賽事組別 3 group CTA cards physically relocated from after the 02 OVERVIEW to right after the HERO. New homepage order: Hero → 3 group cards → Co-organizers → 預計規模 → 02 OVERVIEW → 04 PATHWAY → 05 JUDGING → 06 TIMELINE → 07 N.O.R.A. (section comments left in original order for diff hygiene). | `index.html` |
| 2026-09-06 | User → Kilo | T5 (extension) | "also add 幼兒組，小學組，中學組 in the nav. bar" — Added 3 segment links (幼兒/小學/中學, color-coded by group) to the desktop + mobile nav of all 5 pages, separated from the 4 page anchors by a 1px hairline divider. Replaces the previous "首頁/幼兒章程/..." cross-page nav. | `index.html`, `apply.html`, `kindergarten.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | T5 (extension) | "remove this part of evey page" — the `<div class="util-strip">` ("教育局「心繫家國」聯校活動 · 慶祝香港回歸30周年") was still present in the 3 prospectus pages after the earlier removal. Stripped from `kindergarten.html` / `primary.html` / `secondary.html`; headers were already at `top-0` so no offset adjustment needed. | `kindergarten.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | **T20 (banner image)** | Generated 3 level-specific Cartographic Cosmos hero banners (1920×540 each) — kindergarten (teal aurora + "太空想像"), primary (azure + "未來月球基地"), secondary (indigo + "火星移民工程挑戰"). Each banner has eyebrow chip + H1 + italic mission tagline + descriptor + orbits + gold horizon + HKATA registry stamp. | `.kilo/render_prospectus_banners.py`, `doc/img/prospectus-banner-{kindergarten,primary,secondary}.png` |
| 2026-09-06 | User → Kilo | **T20 (banner integration)** | Replaced the 540px empty hero in all 3 prospectus pages with the new banner image. Now: breadcrumb → full-width banner image → 2 CTAs centered. pt-40 → pt-24 (no more empty space — banner fills the hero). | `kindergarten.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | **T20 (density fix)** | Banner images re-rendered at 1920x420 (was 1920x540) with tighter text layout — H1 closer to the breadcrumb, smaller orbits, smaller registry stamp. Section padding pb-10 → pb-6 on all 3 prospectus pages. The "big gap" between breadcrumb and H1 is gone. | `.kilo/render_prospectus_banners.py`, `kindergarten.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | **T26** (Gap fix) | T26 plan called for "move breadcrumb <nav> inside hero section". Resolved by a stronger fix: removed the HTML breadcrumb entirely (already in c590789), shrunk banner image 540→420, lowered section pb-10→pb-6. The stacked-padding gap that T26 described no longer exists. | (no new code; existing commits c590789 + 6f90cd9 already fixed it) |
| 2026-09-06 | User → Kilo | T11 (UX) — **R1 + R2 of UX plan** | (R1) 3 group CTA cards pulled INTO the hero section, right after the deadline line, on a `bg-[var(--surface-900)]` background so the card panel visually separates from the rest of the page. (R2) Hero `pb-8 lg:pb-10` → `pb-2 lg:pb-3`. Eliminates the hero→#overview dead zone, makes the primary CTA visible within 1 viewport scroll on desktop. | `index.html` |
| 2026-09-06 | User → Kilo | **T20** (Prospectus hero banner) | All 3 prospectus pages rebuilt with the new `pt-40 pb-16 bg-[var(--surface-800)]` hero — breadcrumb, mission tagline (太空想像，從藝術起步 / 未來月球基地築夢計劃 / 火星移民工程挑戰), descriptor line, 2 CTAs, dual aurora gradient. | `kindergarten.html`, `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | **T22** (Track order resequence) | primary.html: TRACK 02 AI工程 + TRACK 03 演講 swapped so flagship AI engineering appears before narrower 演講 (P1–P3 only). section-y / surface-alt alternation preserved. secondary.html unchanged (only 2 tracks, order already correct). | `primary.html` |
| 2026-09-06 | User → Kilo | **T23** (In-page anchor nav) | Sticky `top-20 z-30` anchor nav under the hero on primary + secondary. primary: logo/ai/speech/key-dates. secondary: logo/ai/key-dates. Matched `id` attributes added to each track section + KEY DATES. | `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | **T24** (一校多賽道 callout) | Info callout `card p-5 sm:p-6 border-l-4 border-[var(--primary-500)]` with fa-circle-info + 2-line copy ("一校可同時報讀多條賽道..." + "例如..."). Inserted between hero and first track on primary + secondary. kindergarten.html skipped (single track). | `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | **T21** (Hardware kit showcase) | surface-alt card on primary + secondary with eyebrow + sub-copy + 3- or 4-col grid of kit cards. Each card: aspect-video placeholder (`<!-- REPLACE: [kit].jpg -->` comment marker), chip + 1-sentence description + grade tag. primary: 3 kits (CubeSat/E28/太空種植). secondary: 4 kits (CubeSat/Rover/3D火箭/智能機械手). Inserted in the AI工程 section after the mission 簡介 card. | `primary.html`, `secondary.html` |
| 2026-09-06 | User → Kilo | **T25** (Hardware lottery flow) | 4-step grid (1 完成報名 → 2 核實 11月 → 3 抽籤 → 4 領取 2027年1月) inside the hardware showcase card on primary + secondary, below the kit grid. primary-300 step numbers, 2-col mobile / 4-col desktop. | `primary.html`, `secondary.html` |
|---|---|---|---|---|
| _(pending)_ | Kilo | — | _add your first entry here_ | — |

---

## 📥 Added 2026-09-06 — Bug fix: gap between breadcrumb and hero on prospectus pages (T26)

**Task Board row to add:**
| T26 | Fix double top-padding gap on all 3 prospectus pages | §5.4 Enh. 1 bug | ⬜ TODO | |

**Root cause:** The breadcrumb `<nav>` sits *outside* the hero `<section>` with its own `pt-40`. The hero section also has `pt-40`. Two lots of top padding stack = large blank gap visible between the breadcrumb and the hero background.

**Fix (all 3 files: `kindergarten.html`, `primary.html`, `secondary.html`):**

1. **Move the breadcrumb `<nav>` inside the hero `<section>`** as the first child, above the eyebrow chip and H1.
2. **Remove `pt-40` from the breadcrumb `<nav>`** — it no longer needs to clear the fixed header itself.
3. **The hero `<section>` keeps `pt-40`** (or equivalent) — it is now the sole element responsible for clearing the fixed header.

Result: breadcrumb appears flush at the top of the hero band, no gap.
