# HKATA Website Revamp Plan V2 — "Official Space" Direction

> **For:** Kilo Code (implementation) · **Author:** planning pass · **Date:** 2026-09-06
> **Supersedes:** `.kilo/plans/REDESIGN_PLAN.md` (that plan's IA is already built into `index.html`; this plan changes the *visual tone* and *unifies the whole site*).

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
