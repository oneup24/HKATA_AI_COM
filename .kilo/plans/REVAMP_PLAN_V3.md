# HKATA Website Revamp Plan V3

> **For:** Kilo Code (implementation) · **Author:** planning pass · **Date:** 2026-09-06
> **Supersedes:** `.kilo/plans/REVAMP_PLAN_V2.md` (V2 is now the **historical record** — every T1–T29 row it executed is preserved in §V2 Recap below for traceability. V3 is the **live, lean plan** for everything going forward.)

---

## ⚙️ Working Agreement — READ FIRST (for Kilo)

This doc is the **single source of truth** for V3 work. Keep it in sync with reality or it becomes useless.

**Status legend:** `⬜ TODO` · `🔄 DOING` · `✅ DONE` · `⛔ BLOCKED` (needs user/planner) · `➖ N/A` · `↩ REVERTED`

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
4. If the work reverts an earlier task — flip the earlier row to `↩ REVERTED` (Notes column explains) and add **a new Task Board row** that points at the revert. Never silently delete a prior row's status.

---

### ⛔ If blocked

1. Mark the task `⛔ BLOCKED` immediately.
2. Write the specific blocker in the Notes column (what is missing, who needs to act).
3. Tell the user. Do not skip to another task or invent a workaround silently.

---

### 📥 Out-of-band work (user asked directly, no task ID)

1. Create a new Task Board row (next available ID — continue from T30+ in V3).
2. Mark it `🔄 DOING` → do the work → flip to `✅ DONE`.
3. Append a Worklog line. **Never do work silently.**

---

### 🚧 Scope boundary

- Only edit files mentioned in the current task's spec. No "while I'm here" edits to other files.
- Do not add features beyond the spec. If you think something extra would be good, log it as a suggestion in Notes — do not implement unasked.

---

## 📋 V3 Task Board

> Update the **Status** cell as you go. `§` = the detailed spec section in this doc (or `V2§N` for a spec that lives in `REVAMP_PLAN_V2.md`).
> IDs continue from where V2 left off (T30+) to preserve a single global counter.

| ID | Task | Spec | Status | Notes |
|---|---|---|---|---|
| T30 | Wire `apply.html` submission to Google Sheets (Apps Script Web App) | V3 §1 | ✅ DONE | User pasted `/exec` URL 2026-09-06. Inserted fire-and-forget `fetch()` (5 lines) into `submitRegistration()` between the `localStorage` save and the confirmation toast — `mode: 'no-cors'`, `Content-Type: text/plain;charset=utf-8`, body = `JSON.stringify(formData)`, `.catch()` logs a console warning if the Sheet endpoint is unreachable so the localStorage save + on-screen confirmation still proceed. Consent gate at `#consent` (line 402) verified intact. No UI/UX change; no `apply.html` field changes. End-to-end behavior now: every submission → 1 new row in `Registrations` + 1 enriched email to `marketing@hkata.space` + on-screen confirmation + localStorage backup (still works even if Sheet endpoint is down). |
| T31 | Swap `/exec` URL — bound-script unblocks the lookup | V3 §1 | ✅ DONE | ⚠️ User hit `Document … is missing (perhaps it was deleted, or you don't have read access?)` because the original deployment was a **standalone** Apps Script project (`openById()` of an external Sheet fails in that mode). User recreated the script via **Extensions → Apps Script from inside the Sheet** (now container-bound), switched line 5 from `SpreadsheetApp.openById(...)` to `SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations')` (eliminates the whole class of "doc not found" errors), redeployed as a new web app, and pasted the new `/exec` URL. Kilo swapped the URL constant in `apply.html:436`. No other code changed. |
| T32 | Replace bottom toast with a centered success modal on submit | T32 | ✅ DONE | User: "the pop-up to show the 申請編號 now is a very small down at bottom, no good. please a proper pop up a square in the center, something like thank you for apply the competition, here is your 申請編號 and show the next Nov will have result etc." Added a centered modal in `apply.html` (next to the existing `#toast`) + `.modal-backdrop` / `.modal` styles in `assets/theme.css`. Modal shows: ✓ icon + **感謝您的報名！** + appId (gold pill) + **請記下您的申請編號** + "秘書處將於 11月下旬 官宣抽籤分組結果，並通知校方領取官方「硬件套件」" + 關閉 button. Backdrop click + Esc + close button all dismiss. `#consent` toast preserved for the consent-gate error (transient). Token discipline: reuses `--surface-700` / `--gold-500` / `--primary-500` / `--elev-2` / `.btn-gold`; `prefers-reduced-motion` respected. |
| T33 | De-duplicate registration by **學校英文全稱** before submit | V3 § `📥 Added 2026-09-06 — T33` | ✅ DONE | User confirmed defaults: **A soft-block, B one-key (English only), C no appId surfaced**. Implemented: (1) `apply.html` pre-loads the existing-name list on page load via `fetch(EXEC_URL, {method:'GET'})` → caches in `sessionStorage` → builds `window.__hkataKnownNames` Set. (2) Pre-submit check compares `normName(formData.schoolNameEn)` against the Set; if match → `#duplicateModal` with 取消 / 仍然提交 buttons. (3) Extracted `performSubmit(formData)` so the 仍然提交 callback can re-fire the actual submit cleanly. (4) Added `#duplicateModal` markup + `.modal-icon-warn` + `.modal-actions` styles. (5) Apps Script update (user to paste + redeploy): added `doGet()` returning `{count, names}` of normalized English names; added server-side duplicate guard in `doPost()` returning `{ok:false, reason:'duplicate'}` — defense in depth so a bypassed client check still can't dirty the Sheet. |
| T34 | Refine `#duplicateModal` warning copy + button labels | T34 | ✅ DONE | User feedback after T33: current copy reads as "school already registered, contact secretariat" — too passive. User wanted a **directive** warning: "school already applied, please check again and submit again". Implemented variant **B** (per user pick): new copy `此學校已申請過` heading + echoed school name + "請先再次核對學校名稱是否正確" + 2-bullet decision guide + mailto line + button labels `返回核對` (was 取消) / `仍然提交`. Behavior unchanged: 返回核對 closes modal + focuses #schoolNameEn; 仍然提交 re-fires `performSubmit(formData)`. No CSS / Apps Script changes. |
| T35 | Fix: server-side dedupe guard blocks user-approved overrides | T35 | ✅ DONE | **Bug:** teacher clicks 仍然提交 → POST fires → server-side T33 guard returns `{ok:false,reason:'duplicate'}` → `mode:'no-cors'` makes response opaque → client ignores rejection → success modal shows → **no row appended**. **Fix:** added `forceSubmit: false` to default `formData`; in the duplicate modal's 仍然提交 callback, set `formData.forceSubmit = true` before calling `performSubmit(formData)`. Server-side `doPost()` guard condition updated to `if (existing && existing === submittedName && !d.forceSubmit)` → reject; if `forceSubmit === true`, allow the row to be appended. Email subject gains `[重複]` marker + body adds `(注意：此為重複提交...)` so secretariat can audit overrides in their inbox. Sheet rows themselves are unchanged. Apps Script update handed to user to paste + redeploy as new version. |
| T36 | Rebrand org name → **HONG KONG AEROSPACE TALENT DEVELOPMENT FOUNDATION** / 香港航天人材發展慈善基金會 | T36 | ✅ DONE | User asked for org name text update across the site. Replaced `HONG KONG AEROSPACE TECHNOLOGY ACADEMY` → `HONG KONG AEROSPACE TALENT DEVELOPMENT FOUNDATION` and `香港航天科技教育學院` → `香港航天人材發展慈善基金會` in the header logo block + footer block on all 5 main pages (`index.html`, `apply.html`, `kindergarten.html`, `primary.html`, `secondary.html`). Also updated the 4 parked `track0N.html` redirect-stub footers (copyright line + "Limited" suffix dropped — entity is now a Foundation not a Limited company). Short abbreviation `HKATA` kept everywhere (works as initialism for the new name too). **Logo image `doc/img/LOGO 1.png` is unchanged** — text update only; if user wants the logo image redrawn with the new name, that's a separate out-of-band task (image asset). |
| T37 | Swap logo image → `doc/img/LOGO 2.png` (the new brand mark) | T37 | ✅ DONE | User: "please replace the LOGO 1.png with LOGO 2.png". `doc/img/LOGO 1.png` (header logo on `index.html` + `apply.html`) was byte-identical to root `logo.png` (header logo on `kindergarten.html` / `primary.html` / `secondary.html`) — same MD5 — so the new logo had to land in both locations for consistency. Copied `doc/img/LOGO 2.png` → `doc/img/LOGO 1.png` AND `logo.png` (overwrote); removed the now-redundant `doc/img/LOGO 2.png`. No HTML changes (the `<img src>` paths stayed the same; both file paths now point at the new logo content). MD5 confirms both files now match. |
| T38 | Wire 7 hardware kit images into primary + secondary prospectus | T38 | ✅ DONE | User uploaded 7 images to `doc/img/hardware/` (initial pass had `arm.png` 1200×1600 portrait and `rocket.jpg` 468×625 portrait — `object-fit: cover` cropped them to 16:9). Replaced all 7 `<div class="aspect-video ...">` placeholders + `<!-- REPLACE: ... -->` comments in `primary.html` (3 kits) + `secondary.html` (4 kits) with `<img>` tags: `aspect-video w-full object-cover rounded-xl mb-3 loading="lazy" decoding="async"`. CubeSat grade text corrected (primary: `高小 P4–P6` only; secondary: `初中 S1–S3` only). **Re-uploaded 2026-09-06 17:05** — all 7 files now proper 1200×675 16:9 PNG; `rocket` renamed from `.jpg` to `.png` so `secondary.html` rocket `src` updated to `rocket.png`. |
| T39 | Reorder track sections on primary.html + secondary.html so 太空任務標誌設計 (TRACK 01) appears AFTER the 航天 AI 創新大賽 (TRACK 02 AI 工程) section | T39 | ✅ DONE | User picked **variant A** (reorder blocks only, keep TRACK labels as-is — minimal change, accept the 02→01→03 chip ordering). On both `primary.html` and `secondary.html`: TRACK 02 (航天 AI 創新大賽 AI 工程) section moved BEFORE TRACK 01 (太空任務標誌設計). HTML comments + section `id`s preserved so the anchor nav (`#track-logo`, `#track-ai`) still jumps correctly. Alternating section backgrounds preserved (both sections use `section-y` / `surface-alt` matching the prior pattern). Chip text + IDs untouched (variant A). |
| T40 | Add comprehensive 「比賽章程」 section to `primary.html` (7 chapters: 背景 · 對象 · 項目 · 評審 · 日程 · 獎項 · 支援) | T40 | ✅ DONE → 🔄 REWORK → ↩ REWORKED BY T41 | User accepted the structure but **wanted a UI redesign + move to before TRACK 02**. T41 (next row) supersedes this; status flips to **↩ REWORKED** so the original is not double-counted. |
| T41 | Rework T40: move 章程 above TRACK 02 + redesign chapter UI (variant A: document-style) | T41 | ↩ REWORKED BY T42 | Superseded — see T42 (which dissolves the 章程 wrapper entirely and integrates chapters 一 / 二 / 四 / 五 / 六 / 七 as individual top-level sections in the page flow). |
| T42 | Restructure primary.html into linear 10-section flow (drop 章程 wrapper + KEY DATES) | T42 | ✅ DONE → 🔄 REWORK (T43) | User asked to **remove the gold Roman numeral column** from each chapter (一、二、三、 etc.) — the variant-A "big numeral left, content right" layout was rendering too narrow/awkward (the user saw a thin gold bar instead of a proper Chinese numeral character). T43 (next row) drops the numeral + the 2-col grid wrapper, leaving just the chapter title + content. |
| T43 | Remove gold Roman numeral column from chapters 一/二/四/五/六/七 | T43 | ✅ DONE | User feedback after T42: "please remove all the 一、二，etc." — the variant-A 2-col grid with the giant gold 一/二 numeral on the left rendered awkwardly (gold numeral character too thin / layout too narrow). Dropped the entire numeral column AND the grid wrapper for all 6 chapters (ch-1, ch-2, ch-4, ch-5, ch-6, ch-7). Replaced with a small `<p class="eyebrow mb-2 text-[var(--primary-300)]">一、活動背景與宗旨</p>` text-eyebrow above each `<h2>`, keeping the chapter numbering in copy form. Removed one extra `</div>` per chapter (the dangling grid-wrapper closer). |
| T44 | Content corrections on `primary.html` 一、二 chapters | T44 | ✅ DONE | User asked for 3 small content corrections: (1) drop `、香港津貼中學議會` from §一 活動背景 — primary prospectus shouldn't reference secondary-school bodies in the co-organizer list (this is the 小學組章程 page); (2) revise §一 活動願景 `面向全港中小學生` → `面向全港小學生` for the same scope reason; (3) add `（小四至小六）` after `「高小組別」` in §二 參賽對象 so the 高小 vs 初小 split is explicit (matches TRACK 02 AI eligibility footer `高小 P4–P6`). 3 string replacements in `apply.html`... err `primary.html`. No CSS / structural change. |
| T45 | Drop 「未來基地概念藍圖大賽」 judging-criteria card from §四 | T45 | ✅ DONE | User: "remove this part" (the 概念藍圖 judging card in §四). Consistent with T42 (which already dropped the 概念藍圖 sub-track from §三 + the track section itself). The remaining §四 now shows only the AI 工程 7-weight criteria card (since 概念藍圖 is no longer in the primary prospectus). |
| T46 | Drop trailing caption 「著重創新思維與技術可行性，而非作品成本或規模。」 from AI 工程 judging card | T46 | ✅ DONE | User: "remove this part" (the small footnote at the bottom of the AI 工程 judging card in §四). Removed the `<p class="caption mt-3">` paragraph; the AI judging card now ends after the 簡報及答辯 5% line. |
| T47 | Drop 🚀 升空獎勵 card from §六 | T47 | ✅ DONE | User: "remove this part" (the right-side 升空獎勵 card in §六). Removed the entire card (🚀 chip, 專屬航天標誌升空, 冠軍作品升空, 其他獎勵 paragraphs). §六 now shows only the 🏆 獎項級別 card (left side). |
| T48 | Drop parenthetical nicknames from award list (§六) | T48 | ✅ DONE | User: "remove （冠軍）（亞軍）（季軍）". Stripped the Chinese nicknames from 一/二/三等獎 in §六 獎項及獎勵 — `一等獎（冠軍）` → `一等獎`, `二等獎（亞軍）` → `二等獎`, `三等獎（季軍）` → `三等獎`. 優異獎 / 最具創意大獎 unchanged (no nicknames to drop). |
| T49 | Scope-revise 招募階段 line (§五) | T49 | ✅ DONE | User: "revise `全港中小學招募` to `全港小學招募`". Same primary-prospectus scope reasoning as T44 — the §五 timeline's first stage 招募階段 should reference 小學 (not 中小學) on the primary page. Single string replacement. |
| T50 | Drop top in-page anchor nav (T23 sticky bar) | T50 | ✅ DONE | User: "remove this part" (the sticky top anchor nav with 本頁內容 · 報名截止 · 一、背景 · 二、對象 · AI 工程 · 演講 · 標誌設計 · 四、評審 · 五、日程 · 六、獎項 · 七、支援). Removed the entire `<nav>` block (T23). The 10 anchor IDs (`#registration-deadline`, `#ch-1..ch-7`, `#track-ai/speech/logo`) remain on the page so the section IDs still work for any external links or future re-introduction of a TOC. |
| T51 | Shrink 報名截止 banner ~50% (text + padding) | T51 | ✅ DONE | User: "too big, please 50% smaller". Reduced the banner's giant deadline typography: `text-4xl sm:text-5xl` → `text-2xl sm:text-3xl` (~50% — 36/48px → 24/30px). Also dropped the "學校報名截止：" label from `text-base sm:text-lg` to `text-sm sm:text-base`, the section padding `py-12` → `py-10`, and the CTA wrapper `mt-6` → `mt-4`. The banner keeps the same content + structure but is now visually compact (was consuming ~50% of viewport on the screenshot). |
| T52 | Tighten `.section-y` vertical padding ~50% across all sections | T52 | ✅ DONE | User: "again the gap between every section is too big". Reduced `.section-y` in `assets/theme.css`: `clamp(3.5rem, 6vw, 6rem)` → `clamp(1.5rem, 2.5vw, 2.5rem)` (~50% — 56–96px → 24–40px). Affects all 9 `section-y` chapter / track sections on `primary.html`. Visual cadence preserved (sections still feel distinct); page is now far more compact. |
| T53 | Tighten hero → 報名截止 banner gap (remove dead-zone) | T53 | ✅ DONE | User: "this part, bad UX, any hints to fix the gap?" — the dead-zone between the hero CTA buttons (下載章程 PDF / 立即報名) and the 報名截止 banner was visually huge. Reduced hero `pb-6` (24px) → `pb-2` (8px); reduced 報名截止 `py-10` → `pt-4 pb-8` (16px top, 32px bottom). Combined hero-bottom + banner-top gap is now 24px instead of ~64px. The 報名截止 banner now visually reads as the immediate follow-on of the hero CTAs instead of a separate floating element. |
| T54 | Inline 報名截止日期 into hero (matches homepage pattern) | T54 | ✅ DONE | User: "please follow the homepage". On the homepage, 報名截止日期 is rendered **inline within the hero** section as a centered text block directly below the CTA buttons (no separate `<section>` wrapper, no `surface-alt` background, no extra CTA button). On primary, the date was rendered as a standalone surface-alt `<section>` with its own gold CTA button — visually disconnected from the hero. Restructured to match: moved the 報名截止 content into the hero `<section>` as a `<div id="registration-deadline">` text block; deleted the standalone `<section id="registration-deadline">` wrapper. Reordered hero CTAs to match homepage (gold 立即報名 first, ghost 下載章程 PDF second). Hero padding now `pt-24 pb-8`. |
| T55 | Restructure `secondary.html` — same T42+T54 pattern, 中學組 content | T55 | ✅ DONE | User: "now secondary page: same structure but with below content" + verbatim 7-chapter copy for 中學組. Implemented: same linear flow as primary — hero (breadcrumb + 中學 image + gold 立即報名 + ghost 下載章程 PDF + inline 報名截止) → 一、活動背景與宗旨 → 二、參賽對象 → TRACK 02 航天 AI 創新大賽 · 未來火星基地 (4 kits: cubesat-secondary, rover, rocket, arm) → TRACK 01 太空任務標誌設計 (S1–S6) → TRACK 04 未來基地概念藍圖大賽 (NEW for secondary only — primary dropped this in T42) → 四、評審 (2 cards: AI 7-weights + 概念藍圖 5-weights) → 五、比賽日程 (7 stages) → 六、獎項 (5 tiers — secondary **keeps** the (冠軍)/(亞軍)/(季軍) nicknames per user copy, unlike primary which dropped them in T48) → 七、學習支援平台 (N.O.R.A. Kids, 即將推出 honesty note) → BIG APPLY CTA. No TRACK 03 演講 on secondary (it's a primary-only track per the user's content). All secondary-specific content from user's verbatim copy. No 概念藍圖 / 升空 / 其他獎勵 cards dropped (unlike primary's T45-T47). Inlined 報名截止 in hero (matches homepage). Tightened `.section-y` globally (T52) so secondary benefits too. |
| T56 | Scope-revise secondary content (mirror T44) | T56 | ✅ DONE | User: "remove `、香港津貼小學議會`, revise `面向全港中小學生` to `面向全港中學生`". 2 string replacements on `secondary.html` §一 活動背景 + 活動願景 — dropped the 小學議會 reference (secondary prospectus scope, same reasoning as primary T44), revised vision scope from 中小學 to 中學生. | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| T57 | Drop TRACK 04 概念藍圖大賽 + its judging card from `secondary.html` | T57 | ✅ DONE | User: "remove this part" (the TRACK 04 未來基地概念藍圖大賽 section on secondary). Removed the entire TRACK 04 `<section>` block (任務簡介 + 提交項目 + 評審重點) AND its 概念藍圖 judging card from §四 (5 weights). Mirrors T42 on primary (which already dropped the track in the prospectus). Secondary prospectus now has only 2 tracks (TRACK 02 AI + TRACK 01 標誌), matching primary's track list. Linear flow comment updated to reflect 9-section flow (was 10 with TRACK 04). |
| T58 | Drop 評分比重 subsection from §四 on `secondary.html` | T58 | ✅ DONE | User: "remove this part" (the 2. 評分比重 subsection in §四 — heading + AI judging card with 7 weights). Removed the entire `<div>` containing `<h4>2. 評分比重</h4>` + the AI judging card. §四 now contains only the "1. 航天 AI 創新大賽 展示要求" subsection (no judging weights). Note: differs from primary which **kept** the AI judging card — secondary now drops it entirely per user's direction. |
| T59 | Scope-revise 招募階段 line on secondary (§五) | T59 | ✅ DONE | User: "revise `全港中小學招募` to `全港中學招募`". Same secondary prospectus scope reasoning as T49 (primary) + T56 (secondary §一). Single string replacement on `secondary.html` §五 比賽日程 timeline first entry. | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| T60 | Drop 🚀 升空獎勵 card from secondary §六 | T60 | ✅ DONE | User: "remove this part" (the 🚀 升空獎勵 card on secondary). Mirrors T47 (primary). Removed the entire card (🚀 chip + 3 paragraphs: 專屬航天標誌升空 / 冠軍作品升空 / 其他獎勵). §六 on secondary now shows only the 🏆 獎項級別 card on the left. | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| T61 | Drop parenthetical nicknames from award list (secondary §六) | T61 | ✅ DONE | User: "remove （冠軍）（亞軍）（季軍）" — 3 string replacements on `secondary.html` §六: `一等獎（冠軍）` → `一等獎`, `二等獎（亞軍）` → `二等獎`, `三等獎（季軍）` → `三等獎`. (Primary had T48 already; secondary now follows same convention.) | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |

> **V3 is fully closed** as of 2026-09-06 — **T30 + T31 verified end-to-end** by user (live form submit → row in `Registrations` + enriched email to `marketing@hkata.space`). No outstanding work in Kilo's queue. Future work will appear as new rows starting at **T32**, with specs appended in the `📥 Added YYYY-MM-DD` section below.
>
> **V2 carry-in settled:** **T19 → T30** (submission backend → Google Sheets). All other V2 tasks were settled already (T1–T18 ✅, T20–T23 + T25–T28 ✅, T24 ↩ REVERTED, T29 ✅). See V2 Recap below for the snapshot.

---

## 📜 V2 Recap — what was shipped (historical snapshot)

> **Read-only summary of V2.** Full detail, including each row's Notes column and the Worklog, lives in `.kilo/plans/REVAMP_PLAN_V2.md`. Listed here only as a quick "what's already done" reference for context when planning V3 work.

**Outcome:** V2 took the site from a neon/sci-fi prototype to the current "Official Space" look across 5 pages (`index.html`, `apply.html`, `kindergarten.html`, `primary.html`, `secondary.html`), with three new segment-based prospectus pages replacing the old `track01/03/04.html`, a shared `assets/theme.css` token layer, real secretariat contact (`marketing@hkata.space` / `61130828`), Noto Sans TC + Space Grotesk + Noto Serif TC typography, single-step apply form, Google OG / Twitter / favicon metadata, and a handful of bug fixes.

**Task count (V2 only):** 29 rows (T1–T29) · 27 ✅ DONE · 1 ➖ MOVED (T19 → V3 T30) · 1 ↩ REVERTED (T24).

### Highlights by area

- **Design system (T1–T4)** — `assets/theme.css` (Option A, no build) with the navy + azure + gold + desaturated-group-accent palette; Noto Sans TC / Space Grotesk / Noto Serif TC / Inter (kept) / IBM Plex Sans fallback; Orbitron retired; starfield canvas removed; `prefers-reduced-motion` respected.
- **Header (T5)** — top utility strip added then **removed** per user; main header kept with white nav links, gold-ringed `doc/img/LOGO 1.png`. Later extension: 3 segment links (幼兒/小學/中學, color-coded by group) added to all 5 pages.
- **Bugs / placeholders / meta (T6)** — `secretariat@hkata.example` → `marketing@hkata.space`, phone `61130828`; App Store / Google Play → "即將推出" email-notify; OG/Twitter/canonical/favicon on every page.
- **Content (T7, T18)** — 3 prospectus pages re-written; deadlines split (報名截止 2026/10/31 + 提交作品 2027/3/31); `index.html` `#overview` reduced to 4 features (6-goals + stat tiles + awards + utility strip removed per user); stat tiles relocated to standalone "預計規模 · At Scale" band.
- **Segment-based prospectus pages (T8–T11)** — `kindergarten.html` / `primary.html` / `secondary.html` built from the §1.5 template; homepage 3 cards repointed (killed the "both → track01.html" bug); `track01/03/04.html` retired to thin redirect stubs; `track02.html` parked/unlinked.
- **Apply form (T13–T17)** — single-step (Steps 2–4 removed); "初步建議負責人" framing; `teacherTitle` → 10-role dropdown with "other" reveal; district dropdown → all 18 HK districts in `<optgroup>` blocks; `?level=` pre-selects school category + segment + tracks + records `referrerLevel`; consent checkbox added.
- **Prospectus enhancements (T20–T25)** — level-specific Cartographic Cosmos hero banners (1920×420) integrated into all 3 prospectus pages; hardware kit showcase (primary: 3 kits / secondary: 4 kits) with aspect-video placeholders + `<!-- REPLACE: [kit].jpg -->` markers; primary.html track order resequenced (AI工程 before 演講); sticky in-page anchor nav under hero on primary + secondary; ⚠️ **T24 "一校多賽道" callout was REVERTED via T29** per user; 4-step hardware-lottery flow added below the kit grid.
- **Bug fixes (T26, T27)** — fixed a 256px stacked-padding gap on all 3 prospectus pages (breadcrumb moved inside the hero `<section>`); fixed a ~100px blank gap above the homepage hero banner (hero `pt-44 lg:pt-52` → `pt-20 lg:pt-20`).
- **Out-of-band fixes (T28, T29)** — T28 fixed a dead same-page anchor (`#tracks` did not resolve → added `id="tracks"` to `<h2>三大賽事組別</h2>`). T29 reverted T24.

### Known open / pending work from V2

> All V2 work is now either ✅ DONE, ↩ REVERTED (T24), or moved into V3 (T19 → T30 above). Nothing remains on V2.

### Carry-over into V3

| ID | Task | V3 row | Spec location in V3 |
|---|---|---|---|
| T19 (V2) | Submission backend → Google Sheets | **T30** | See "📥 Added 2026-09-06 — T19 → T30" — Apps Script + `no-cors` `fetch()` + PDPO checkbox all copied verbatim. |

---

## 1. Active scope for V3

> V3 starts empty. New tasks land here as the user requests them. The detailed spec for each is appended at the bottom of this file under a `## 📥 Added YYYY-MM-DD` header (per the Working Agreement).
>
> If you find yourself implementing something that isn't on the board yet — that's a signal to add a row first (out-of-band work rule), not to skip the board.

---

## 2. Reference index (carry-overs from V2)

> **Don't re-spec what V2 already settled.** When V3 work touches an area V2 already designed, link to V2's spec rather than rewriting it.

| Topic | Where it lives | Status under V3 |
|---|---|---|
| Design tokens & color palette | V2 §2.1, §2 | Settled — used in V3 as-is unless user overrides |
| Typography stack | V2 §2.2 | Settled |
| Motion / texture rules | V2 §2.3 | Settled |
| Header treatment | V2 §2.4 | Settled (top utility strip removed per user) |
| Segment-based IA | V2 §1.5 | Settled — 3 prospectus pages are stable |
| Apply form fields & validation | V2 §5.1 A–D | Settled — single-step form is the contract |
| `#overview` redesign | V2 §5.2 | Settled (4 features + "預計規模" band) |
| **Submission backend → Google Sheets** | **V3 §1 (carry-in from V2 §5.3)** | **⛔ BLOCKED — T30, awaiting user `/exec` URL** |
| Prospectus page enhancements | V2 §5.4 | All Enh. 1–6 settled; T24 ↩ REVERTED |

---

## 3. Acceptance / QA checklist (carried forward — apply to every V3 task)

> Same contract as V2 §7. Re-check on every V3 task that lands:

- [ ] All affected pages share identical header, footer, fonts, and token values — no page redefines a color differently.
- [ ] Zero `shadow-glow-*` / neon usages remain; starfield canvas not reintroduced.
- [ ] Traditional Chinese renders in Noto Sans TC on Chrome + Safari.
- [ ] Every new link resolves to the correct page or anchor; no dead same-page anchors.
- [ ] No new `*.example` addresses or dead `<button>` store links ship.
- [ ] OG / Twitter / canonical / favicon stay correct on every page touched.
- [ ] Contrast AA: body ≥ 4.5:1, large text ≥ 3:1 on `--surface-900`.
- [ ] Keyboard focus visible (`--primary-500`, 2px) on all interactive elements.
- [ ] `prefers-reduced-motion` disables remaining transitions.
- [ ] Mobile: sticky CTA, collapsible nav, no horizontal overflow.

---

## 4. Out of scope (unchanged from V2 §9)

公眾投票 (Public Voting), 升空 / To-Space launch features, and 未來基地概念藍圖大賽 promotion are **not** surfaced on the homepage. `track02.html` remains reachable but unlinked from home.

---

## 📝 V3 Worklog — append newest at the top

> **Format:** `YYYY-MM-DD · <who> · <task ID> · <what changed> · <files>`
> V2 history lives in `REVAMP_PLAN_V2.md` Worklog (rows 674–712) — do not duplicate here. Only V3 tasks land in this worklog.

| Date | Who | Task | What changed | Files |
|---|---|---|---|---|
| 2026-09-06 | Kilo | **T19 → T30** (carry-in) | Carried V2 T19 (submission backend → Google Sheets) into V3 as T30. Status ⛔ BLOCKED on V3 (unchanged from V2). Added `📥 Added 2026-09-06 — T19 → T30` block with the §5.3 spec copied verbatim (Apps Script, sheet header row, `no-cors` `fetch()` wiring, PDPO consent checkbox, retry fallback). V2 T19 row flipped to `➖ MOVED → V3 T30`. | `.kilo/plans/REVAMP_PLAN_V2.md`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T30** (spec correction) ⚠️ | User asked me to re-verify the spec against the live `apply.html` form before they built the Sheet. Found a drift between V2 §5.3 and the current form: (a) `principalName` / `principalEmail` fields **dropped** from the form (V2 T18 ext — 校長授權 section removed), (b) `teacherTitleOther` / `tracks` / `referrerLevel` fields **added** since §5.3 was written. Updated V3 §1 in place: header row is now 15 cols (A–O), Apps Script rewrites the `appendRow()` positions + enriches the notification email with 學段/賽道/負責人/電郵/電話/來源頁. Design notes (comma-separated 賽道, separate 職銜(其他), 來源頁 attribution) recorded. T30 Notes column updated with the correction pointer. No client-side change to `apply.html` required — the `fetch()` body is whatever `formData` is already built. | `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T30** (deploy) | User finished Steps 1-7 of the Sheet setup (15-col header + corrected Apps Script deployed + Sheet sharing locked down). User pasted the `/exec` URL. Kilo inserted fire-and-forget `fetch()` (~5 lines) into `apply.html`'s `submitRegistration()` between the `localStorage` save and the confirmation toast, with `.catch()` fallback so the localStorage save + on-screen confirmation still proceed even if the Sheet endpoint is unreachable. `#consent` gate verified intact (no UX regression). T30 flipped ⛔ BLOCKED → ✅ DONE. | `apply.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T31** ⚠️ (URL swap after deploy fix) | First test submission failed — Apps Script Executions log showed `Document … is missing (perhaps it was deleted, or you don't have read access?)`. Root cause: original standalone Apps Script project couldn't access the Sheet via `openById()`. User recreated the script via Extensions → Apps Script from inside the Sheet (now container-bound), swapped line 5 to `SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations')`, redeployed, and pasted the new `/exec` URL. Kilo swapped the URL in `apply.html:436`. No code logic changed; only the endpoint URL. T31 row added to Task Board. | `apply.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T30 / T31 — closure** ✅ | User confirmed end-to-end success: form submit → new row in `Registries` + enriched notification email to `marketing@hkata.space`. T30 (wiring) + T31 (URL swap after standalone-vs-bound fixup) both functionally verified. V3 queue is empty; next task ID will be T32. Closure notes added to the Task Board closing line. | (no file changes — plan update only) |
| 2026-09-06 | User → Kilo | **T32** (success modal) | User: bottom toast for submission confirmation was too small / too transient and didn't surface the appId prominently. Replaced with a centered modal: ✓ icon, **感謝您的報名！**, appId displayed in a gold pill, "秘書處將於 11月下旬 官宣抽籤分組結果，並通知校方領取官方「硬件套件」。", gold 關閉 button. Backdrop click + Esc + close button all dismiss. Existing `#consent` toast preserved for the consent-gate error so transient messages don't need a full modal. Tokens reused (`--surface-700`, `--gold-500`, `--primary-500`, `--elev-2`, `.btn-gold`); `prefers-reduced-motion` respected. | `apply.html`, `assets/theme.css`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T33** (planning) | User requested a pre-submit duplicate check using "學校英文全稱" as the dedupe key. Asked Kilo to plan before implementing. Spec drafted in `📥 Added 2026-09-06 — T33` block (server `doGet()` exposes English-name list; client pre-loads + caches in `sessionStorage`; soft-block modal on match; server-side `doPost()` duplicate guard as defense-in-depth). **Implementation paused** for user confirmation on 3 design choices (soft vs hard block; single vs two-key dedupe; surface existing appId or not). No code change yet. | `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T33** (implement) | User accepted defaults (soft / one-key / no appId surfaced). Implemented: `apply.html` adds `loadKnownNames()` IIFE → `window.__hkataKnownNames` Set (cached in `sessionStorage`); pre-submit check via `normName()`; new `#duplicateModal` with 取消 / 仍然提交 buttons; refactored submit handler to extract `performSubmit(formData)` so the 仍然提交 callback cleanly re-fires the actual submit; added `.modal-icon-warn` + `.modal-actions` styles. Apps Script update handed to user to paste + redeploy (adds `doGet()` + server-side duplicate guard in `doPost()`). | `apply.html`, `assets/theme.css`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T34** (planning) | User feedback after T33 implementation: current soft-block modal reads as "school already registered, contact secretariat to update" — they want a more **directive** warning that explicitly says "school already applied, please check again and submit again if correct". Spec drafted in `📥 Added 2026-09-06 — T34` block; 2 button-label variants proposed (A: 取消 / 仍然提交 — keep; B: 返回核對 / 仍然提交 — rename 取消 for clearer intent). Awaiting user pick. No code change yet. | `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T34** (implement) | User picked variant B. Refined `#duplicateModal` body copy: heading `此學校已登記` → `此學校已申請過`; added "請先再次核對學校名稱是否正確" + 2-bullet decision guide; Cancel button renamed `取消` → `返回核對` for action-clarity. Behavior unchanged: 返回核對 closes + focuses #schoolNameEn; 仍然提交 re-fires performSubmit. No CSS / Apps Script changes. | `apply.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T35** (planning) | User reported: when teacher triggers duplicate modal and clicks 仍然提交, the success modal shows but no row appears in the Sheet. Root cause: T33 server-side duplicate guard returns `{ok:false, reason:'duplicate'}` for ALL duplicates; `mode:'no-cors'` makes the response opaque so client ignores rejection. Spec drafted in `📥 Added 2026-09-06 — T35` block: add `forceSubmit` flag to request body, server-side guard only rejects when `forceSubmit !== true`. Email subject gets `[重複]` marker so secretariat can identify overrides. No code change yet. | `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T35** (implement) | Added `forceSubmit: false` to default `formData` in `apply.html`; in the duplicate modal's 仍然提交 callback, set `formData.forceSubmit = true` before calling `performSubmit(formData)`. Apps Script update handed to user to paste + redeploy: guard condition `if (existing && existing === submittedName && !d.forceSubmit)` → reject; email subject gets `[重複]` prefix + body appends `(注意：此為重複提交 — 用戶已於表單確認覆核)` when force-submitted. | `apply.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T36** (rebrand) | User asked for org name text update across the site. Replaced `HONG KONG AEROSPACE TECHNOLOGY ACADEMY` → `HONG KONG AEROSPACE TALENT DEVELOPMENT FOUNDATION` and `香港航天科技教育學院` → `香港航天人材發展慈善基金會` in header + footer on all 5 main pages + 4 parked `track0N.html` redirect stubs. Dropped the `Limited` suffix on `track0N.html` copyright lines (entity is now a Foundation). Short `HKATA` abbreviation kept. Logo image `doc/img/LOGO 1.png` is **unchanged** — text-only rebrand. | `index.html`, `apply.html`, `kindergarten.html`, `primary.html`, `secondary.html`, `track01.html`, `track02.html`, `track03.html`, `track04.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T37** (logo swap) | User: "please replace the LOGO 1.png with LOGO 2.png". `doc/img/LOGO 1.png` (header on index/apply) was byte-identical to root `logo.png` (header on kindergarten/primary/secondary). Copied `doc/img/LOGO 2.png` → `doc/img/LOGO 1.png` AND `logo.png` so the new brand mark shows on all 5 pages. Removed the now-redundant `doc/img/LOGO 2.png`. No HTML changes (the `<img src>` paths stayed the same). | `doc/img/LOGO 1.png`, `logo.png`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T38** (hardware images) | User uploaded 7 hardware kit images to `doc/img/hardware/`. Replaced 7 `<div class="aspect-video">` placeholders + `<!-- REPLACE: -->` comments in `primary.html` (3 kits) + `secondary.html` (4 kits) with `<img>` tags using `aspect-video w-full object-cover` so portrait images (arm 1200×1600, rocket 468×625) crop cleanly. CubeSat grade text split correctly (primary: 高小 P4–P6 only; secondary: 初中 S1–S3 only — was previously the combined range). | `primary.html`, `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T38** (reupload fix) | User re-uploaded all 7 hardware images — now proper 1200×675 16:9 PNG. Two portrait images (`arm.png`, `rocket.jpg`) re-supplied at the right aspect ratio. `rocket` renamed from `.jpg` to `.png` → updated `secondary.html` rocket `src` to `rocket.png`. `arm.png` and `cubesat-secondary.png` re-supplied (sizes changed). All other src references unchanged. | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T39** (planning) | User asked to move the 太空任務標誌設計 (TRACK 01) section to appear AFTER the 航天 AI 創新大賽 (TRACK 02 AI 工程) section on primary.html + secondary.html. Request is structurally ambiguous (block reorder vs. full renumber), so 3 variants drafted in `📥 Added 2026-09-06 — T39` block. Awaiting user pick. | `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T39** (implement) | User picked variant A (reorder blocks only, keep TRACK labels as-is — minimal change). On both `primary.html` and `secondary.html`: moved TRACK 02 (航天 AI 創新大賽 AI 工程) `<section>` block to come BEFORE the TRACK 01 (太空任務標誌設計) `<section>` block. Section `id`s + HTML comments preserved so the in-page anchor nav still works. No chip text changes (variant A contract). Alternating backgrounds preserved. | `primary.html`, `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T40** (planning) | User asked for a full 比賽章程 section on primary.html using their official 7-chapter content (活動背景、參賽對象、賽事項目、評審準則、比賽日程、獎項獎勵、N.O.R.A. 學習支援). Spec drafted in `📥 Added 2026-09-06 — T40` block: single new section between `#key-dates` and the BIG APPLY CTA, with sticky in-section sub-nav (一–七) + 7 card-styled chapters. **3 open design choices** awaiting user confirmation: A) sub-nav sticky vs inline, B) §三 sub-track layout (2-col vs 4-col), C) §五 schedule timeline (vertical vs horizontal). | `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T40** (implement) | User picked variant A (sticky sub-nav). Implemented: new `<section id="charter">` between `#key-dates` and BIG APPLY CTA with sticky sub-nav (`top-20 z-20`) listing 7 chapter anchors; 7 chapters rendered with user's exact text — 一 background / 二 participants / 三 4 sub-tracks in 2-col chip-coded grid / 四 judging with 2-col criteria cards / 五 7-stage vertical timeline with gold milestones / 六 awards 2-col grid / 七 N.O.R.A. Kids APP with 「即將推出」 honesty note. Top anchor nav extended with 「比賽章程」 link. No CSS changes — pure markup. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T41** (planning) | User reviewed T40 and asked for two changes: (1) move the 章程 section to **before** TRACK 02 (AI 工程) instead of after KEY DATES, so 章程 becomes the first content section after the hero/anchor-nav; (2) redesign the chapter UI — current cards feel heavy / under-designed. 3 redesign variants drafted in `📥 Added 2026-09-06 — T41` block; awaiting user pick. | `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T41** (implement) | User picked variant A (document-style flowing chapters). Removed old T40 card-style 章程 block from after KEY DATES; inserted redesigned variant-A block before TRACK 02. New chapter markup: outer `<article>` has no `.card` wrapper, uses `py-12 border-t border-[var(--border-soft)] first:border-t-0`; inner is a 2-col grid `[120px gold-numeral | chapter title + content]`; the gold Roman numeral uses `text-7xl md:text-8xl font-display font-bold text-[var(--gold-500)] leading-[0.85]`. Sub-track (§三) / judging criteria (§四) / awards (§六) / APP (§七) cards kept inside the chapter wrappers. Timeline (§五) unchanged. All chapter content (user's exact text) preserved. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T42** (planning) | User asked for major restructure of primary.html into linear 10-section flow. New order: hero → anchor-nav → 報名截止 banner → 一、活動背景 → 二、對象 → TRACK 02 AI → TRACK 03 演講 → TRACK 01 標誌 → 四、評審 → 五、比賽日程 → 六、獎項 → 七、支援 → BIG APPLY CTA. KEY DATES section removed. 章程 wrapper dissolved. Spec drafted in `📥 Added 2026-09-06 — T42` block; user confirmed by listing the 10 sections in order. | `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T42** (implement) | Implemented linear 10-section flow on `primary.html`: 報名截止 banner (gold deadline + 立即報名 CTA, like homepage pattern) at top, then 7 standalone sections + 3 track sections + BIG APPLY CTA. 章程 wrapper fully dissolved (was a 320-line `<section id="charter">`); chapters 一/二/四/五/六/七 are now top-level `<section>` elements with variant-A markup (gold Roman numeral left, content right). Chapter III (4 sub-track cards) deleted — the actual track sections already cover the events. KEY DATES section removed (replaced by the more detailed 五、 timeline). Track order now AI → 演講 → 標誌 per user request (was AI → 標誌 → 演講). TRACK 01's bg class flipped from `surface-alt` to base for proper alt/base alternation across all 10 sections. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T43** (implement) | Removed the gold Roman numeral column from all 6 chapters (一/二/四/五/六/七) — the variant-A 2-col grid `[120px gold-numeral | content]` rendered awkwardly (numeral too thin). Dropped both the numeral column AND the grid wrapper. Added a small `<p class="eyebrow mb-2 text-[var(--primary-300)]">一、活動背景與宗旨</p>` above each `<h2>` as a text-based eyebrow. Removed one extra `</div>` per chapter (the dangling grid-wrapper closer). All chapter IDs + content unchanged. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T44** (content corrections) | 3 string replacements on `primary.html`: (1) §一 活動背景 dropped `、香港津貼中學議會` from the co-organizer list (primary prospectus scope); (2) §一 活動願景 `面向全港中小學生` → `面向全港小學生` (same scope); (3) §二 參賽對象 added `（小四至小六）` after `「高小組別」` so the 高小 vs 初小 split is explicit (matches TRACK 02 AI eligibility footer). | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T45** (drop 概念藍圖 judging card) | Removed the `未來基地概念藍圖大賽` judging-criteria card from §四 of `primary.html` (5 weights: 創意與未來視野 30%, 問題定義與解難 30%, AI 應用概念 20%, 藍圖設計與可行性 15%, 短片表達與團隊演繹 5%). Consistent with T42 (concept-blueprint track already dropped from the prospectus). §四 now shows only the AI 工程 7-weight card. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T46** (drop AI caption) | Removed the trailing caption `<p class="caption mt-3">著重創新思維與技術可行性，而非作品成本或規模。</p>` from the AI judging card in §四. The AI judging card now ends cleanly after the 簡報及答辯 5% line. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T47** (drop 升空獎勵 card) | Removed the entire 🚀 升空獎勵 card from §六 獎項及獎勵 of `primary.html` (chip + 3 paragraphs: 專屬航天標誌升空 / 冠軍作品升空 / 其他獎勵). §六 now shows only the 🏆 獎項級別 card on the left. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T48** (drop award nicknames) | 3 string replacements on `primary.html` §六: dropped Chinese nicknames from 一/二/三等獎. `一等獎（冠軍）` → `一等獎`, `二等獎（亞軍）` → `二等獎`, `三等獎（季軍）` → `三等獎`. 優異獎 / 最具創意大獎 unchanged (no nicknames to drop). | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T49** (scope 招募) | §五 比賽日程 timeline first entry: `全港中小學招募` → `全港小學招募`. Same primary-prospectus scope reasoning as T44 — the 招募 stage should reference 小學 not 中小學 on the primary page. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T50** (drop anchor nav) | Removed the entire T23 in-page anchor nav (sticky `top-20 z-30` bar with 本頁內容 + 10 chapter/track links). Section IDs (`#registration-deadline`, `#ch-1..ch-7`, `#track-ai/speech/logo`) untouched — any external links or future TOC can still target them. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T51** (shrink banner) | Reduced the 報名截止 banner to ~50% size on `primary.html`: `text-4xl sm:text-5xl` deadline → `text-2xl sm:text-3xl`; supporting text → `text-sm sm:text-base`; section padding `py-12` → `py-10`; CTA wrapper `mt-6` → `mt-4`. Banner now compact (was consuming ~half viewport). | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T52** (tighten section-y) | Reduced `.section-y` vertical padding in `assets/theme.css`: `clamp(3.5rem, 6vw, 6rem)` → `clamp(1.5rem, 2.5vw, 2.5rem)` (24–40px, ~50% reduction). All 9 `section-y` chapter / track sections on `primary.html` benefit. | `assets/theme.css`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T53** (tighten hero→banner gap) | Tightened hero `pb-6` → `pb-2` and 報名截止 `py-10` → `pt-4 pb-8` to remove the dead-zone between hero CTAs and the 報名截止 banner. Combined gap is now 24px instead of ~64px. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T54** (inline 報名截止) | Matched homepage pattern: 報名截止日期 now rendered inline within the hero `<section>` (centered text block directly below CTAs), not as a standalone surface-alt banner. Hero CTAs reordered to match homepage (gold 立即報名 first, ghost 下載章程 PDF second). Hero padding `pt-24 pb-8`. The standalone `<section id="registration-deadline">` wrapper deleted; the ID moves to an inline `<div>` so any external `#registration-deadline` links still resolve. | `primary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T55** (secondary restructure) | Rewrote `secondary.html` (~319 → 556 lines) with the T42+T54 pattern + 中學組-specific content. 9 standalone sections: hero (with inline 報名截止), 一、活動背景, 二、參賽對象, TRACK 02 航天 AI 火星 (4 kits), TRACK 01 標誌, TRACK 04 概念藍圖 (NEW — primary dropped this), 四、評審 (2 cards: AI + 概念藍圖), 五、比賽日程, 六、獎項 (keeps the (冠軍)/(亞軍)/(季軍) nicknames), 七、N.O.R.A. Kids, BIG APPLY CTA. No 演講 track on secondary. Hero CTAs + breadcrumb updated for 中學; apply.html link uses `level=secondary`. **Bug fix:** initial rebuild accidentally stripped `<!DOCTYPE html>` + `<head>` + nav + footer + scripts (just kept the body), causing mojibake rendering. Fixed by re-attaching the original lines 1–73 (head+nav+main open) and 288–319 (closing main + footer + scripts) around the new body content. | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T56** (secondary scope) | 2 string replacements on `secondary.html` §一: dropped `、香港津貼小學議會` from co-organizer list (secondary prospectus scope — same reasoning as primary T44); revised §一 活動願景 `面向全港中小學生` → `面向全港中學生` (secondary prospectus scope). | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T57** (drop secondary 概念藍圖) | Removed the entire TRACK 04 未來基地概念藍圖大賽 section from `secondary.html` (任務簡介 + 提交項目 + 評審重點). Also dropped the 概念藍圖 judging card from §四 (5 weights). Mirrors T42 from primary prospectus. Secondary now has 2 tracks: TRACK 02 AI + TRACK 01 標誌. Linear flow comment updated to 9 sections. | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T58** (drop secondary 評分比重) | Removed the entire "2. 評分比重" subsection from §四 of `secondary.html` — both the `<h4>` heading and the AI judging card with 7 weights. §四 now contains only the "1. 航天 AI 創新大賽 展示要求" subsection. Differs from primary (which kept the AI card); secondary drops it entirely per user's direction. | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T59** (secondary scope 招募) | §五 比賽日程 timeline first entry: `全港中小學招募` → `全港中學招募`. Secondary prospectus scope (same as T49 on primary + T56 on secondary §一). | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T60** (drop secondary 升空獎勵) | Removed the entire 🚀 升空獎勵 card from §六 獎項及獎勵 on `secondary.html` (chip + 3 paragraphs: 專屬航天標誌升空 / 冠軍作品升空 / 其他獎勵). §六 now shows only the 🏆 獎項級別 card on the left. | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |
| 2026-09-06 | User → Kilo | **T61** (secondary drop award nicknames) | 3 string replacements on `secondary.html` §六: dropped Chinese nicknames from 一/二/三等獎. (Primary had T48 already; secondary now follows same convention.) | `secondary.html`, `.kilo/plans/REVAMP_PLAN_V3.md` |

---

## 📥 Added 2026-09-06 — T19 → T30 (Submission backend carry-in)

> **Why this row exists:** T19 in `REVAMP_PLAN_V2.md` is the same task. Promoting it to V3 (1) gives us a live, non-`BLOCKED` carry-in row, (2) keeps V2 frozen as the historical record, (3) lets the User ↔ Kilo unblock handshake (`/exec` URL handoff) happen on this plan.

**Task Board row to add:**
| T30 | Wire `apply.html` submission to Google Sheets (Apps Script Web App) | §1 below | ⛔ BLOCKED | Carried in from V2 T19. User to provide: (1) Google Sheet with `Registrations` tab + header row, (2) Apps Script deployed as Web App, (3) the `/exec` URL. Kilo then wires `fetch()` into `submitRegistration()`. |

---

### §1 — Spec (carry-in from V2 §5.3, **corrected 2026-09-06** to match the live `apply.html` form)

**⚠️ Spec correction (2026-09-06):** The V2 §5.3 spec assumed `principalName` / `principalEmail` fields and did not mention `teacherTitleOther` / `tracks` / `referrerLevel`. The live `apply.html` form (built up through V2 worklog entries) **removed** the principal fields (V2 T18 extension: "校長授權 section removed") and **added** the other three. The Sheet header + Apps Script below are aligned to **what the form actually collects today**, not what V2 §5.3 originally said. Kilo's client wiring (`fetch(JSON.stringify(formData))`) does **not** change — `formData` is whatever `apply.html` builds.

**Problem.** `apply.html`'s submit handler (lines 400-440) only writes to the visitor's own `localStorage` + generates a client-side `appId`. **The data never reaches the secretariat.** Every submission is currently lost.

**Chosen solution:** Google Apps Script Web App (free, no server, works from static hosting). Alternatives considered and rejected: SheetDB / Sheety (row-capped free tier), Formspree / Basin (email + dashboard), native Google Form (zero-code but loses the custom UI). Apps Script wins on cost + control.

#### Split of responsibilities
- **User does (needs a Google account — NOT Kilo):**
  1. Create the Google Sheet.
  2. Add a tab called **`Registrations`**.
  3. Paste the Apps Script (provided below) into the Sheet's Apps Script editor.
  4. Set `SHEET_ID` to the Sheet's ID.
  5. Deploy as Web App — **Execute as: Me · Access: Anyone**.
  6. Hand the **`/exec` URL** back to Kilo.
- **Kilo does:** wire the `fetch()` into `submitRegistration()`, add the consent checkbox + validation (PII gate), keep the existing `localStorage` save + confirmation screen.

#### Sheet — corrected header (15 columns, A–O)
- Tab name: **`Registrations`**
- Header row (cells A1:O1, exact order, exact spellings):

| Col | Header | Source field on `formData` |
|---|---|---|
| A | `時間戳` | `new Date()` (auto) |
| B | `申請編號` | `d.appId` |
| C | `學校中文` | `d.schoolNameCn` |
| D | `學校英文` | `d.schoolNameEn` |
| E | `學校類別` | `d.schoolCategory` |
| F | `分區` | `d.schoolDistrict` |
| G | `地址` | `d.schoolAddress` |
| H | `學段` | `d.level` |
| I | `賽道` | `d.tracks.join(', ')` (e.g. `"logo, engineering"`) |
| J | `負責人姓名` | `d.teacherName` |
| K | `職銜` | `d.teacherTitle` |
| L | `職銜(其他)` | `d.teacherTitleOther` (empty unless `teacherTitle === 'other'`) |
| M | `負責人電郵` | `d.teacherEmail` |
| N | `負責人電話` | `d.teacherPhone` |
| O | `來源頁` | `d.referrerLevel` (e.g. `"primary"`, from URLSearchParams on prospectus deep-link) |

**Design choices:**
- **Drop** the original V2 spec's `校長` / `校長電郵` columns — the form no longer collects principal data (the "校長授權" section was removed in V2 T18).
- **Add** `學段` + `賽道` immediately after `地址` so the first 8 columns read as **school identity → competition choice → contact**, in that order. Makes filtering/sorting by level + track intuitive.
- **`賽道` stored as a comma-separated string** rather than separate columns or JSON. Keeps the schema stable even if new 賽道 appear; one column instead of 3–4.
- **`職銜(其他)` kept as its own column** so analytics can separate `"other"`-titled staff from the 10 standard roles.
- **`來源頁`** records which prospectus page drove the registration (`primary` / `secondary` / `kindergarten`), so analytics can attribute traffic.

#### Apps Script (`Code.gs`) — user pastes, sets `SHEET_ID`, deploys as Web App (Execute as: Me · Access: Anyone)
```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('Registrations');
    var d = JSON.parse(e.postData.contents);
    var tracksStr = (d.tracks && d.tracks.length) ? d.tracks.join(', ') : '';
    sheet.appendRow([
      new Date(),                                    // A 時間戳
      d.appId,                                       // B 申請編號
      d.schoolNameCn,                                // C 學校中文
      d.schoolNameEn,                                // D 學校英文
      d.schoolCategory,                              // E 學校類別
      d.schoolDistrict,                              // F 分區
      d.schoolAddress,                               // G 地址
      d.level,                                       // H 學段
      tracksStr,                                     // I 賽道
      d.teacherName,                                 // J 負責人姓名
      d.teacherTitle,                                // K 職銜
      d.teacherTitleOther || '',                     // L 職銜(其他)
      d.teacherEmail,                                // M 負責人電郵
      d.teacherPhone,                                // N 負責人電話
      d.referrerLevel || ''                          // O 來源頁
    ]);
    MailApp.sendEmail(
      'marketing@hkata.space',
      '新學校報名：' + d.schoolNameCn,
      d.schoolNameCn + ' (' + d.appId + ') 已提交報名。' +
      '\n學段：' + d.level +
      '\n賽道：' + (tracksStr || '-') +
      '\n負責人：' + d.teacherName + ' / ' + d.teacherTitle +
      (d.teacherTitleOther ? ' (' + d.teacherTitleOther + ')' : '') +
      '\n電郵：' + d.teacherEmail + ' / 電話：' + d.teacherPhone +
      (d.referrerLevel ? '\n來源頁：' + d.referrerLevel : '')
    );
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally { lock.releaseLock(); }
}
```

#### Client wiring (Kilo) — inside the existing submit handler, after `formData` is built
```javascript
fetch('YOUR_WEB_APP_EXEC_URL', {
  method: 'POST',
  mode: 'no-cors',                                  // avoids CORS preflight setup
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(formData)
});
// keep existing localStorage save + confirmation screen; appId stays client-generated
```
- **No client-side field changes needed** — `formData` is already built correctly by `apply.html:415-430`. The only client work Kilo does is adding the `fetch()` call (and the consent gate below).
- `no-cors` = response is opaque (can't be read) — fine, because `appId` is generated locally already.
- **Lightweight failure fallback:** wrap in `try/catch` and, if `fetch` throws, still show the confirmation + `console.warn` for retry (data also persists in localStorage). UX must not block the user on a Sheet outage.

#### PII / compliance (HK PDPO — required)
- **Consent checkbox** is already in the form (`apply.html:325` `#consent`). Kilo verifies it is `required` and the submit handler already blocks on it (line 402-409). If any drift happens, re-tighten.
- **Restrict Sheet sharing** to secretariat accounts only — it holds teacher emails & phones. (Schools intentionally do NOT submit principal data any more, since V2 T18.)
- Add a short privacy note / link in `apply.html` footer (optional but recommended for an official site).

#### Result — what "done" looks like
1. Every form submission results in **one new row** in the `Registrations` tab, with **all 15 columns populated** (L and O may be blank if `teacherTitle !== 'other'` and there is no `referrerLevel`, respectively).
2. `marketing@hkata.space` receives **one email** per submission, **enriched** with 學段 / 賽道 / 負責人 / 電郵 / 電話 / 來源頁 so the secretariat can triage without opening the Sheet first.
3. `localStorage` save + on-page confirmation screen still work exactly as they do today (no UX regression).
4. If the Apps Script is down / unreachable, **the user still gets the confirmation screen** and the submission is queued for retry (data already in `localStorage`).
5. Submit button is **blocked** until the PDPO consent checkbox is ticked.
6. The Kilo-side change diff for `apply.html` is ~5 lines (one `fetch` + one `try/catch`) plus a verification comment that the `#consent` gate is intact.

#### ✅ Verified 2026-09-06 (T30 + T31 closure)
End-to-end live test passed: form submit → new row in `Registrations` + enriched email at `marketing@hkata.space`. Notes for ongoing operation:

- **The script MUST stay container-bound.** If anyone ever tries to migrate the Apps Script to a standalone project (i.e. opens `appscript.google.com` and creates a new project, then pastes this code), `openById()` will start failing again with "Document … is missing". The fix is always the same: `SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations')` inside a script opened from the Sheet's **Extensions → Apps Script**.
- **Backup path is intact.** If the `/exec` URL ever goes down or the script breaks, teachers still see the on-screen confirmation + the submission sits in `localStorage` under key `hkata_registration`. A future bulk-retry handler could read that key — not in scope now.
- **Sheet hygiene.** Locked down to secretariat accounts only in Step 7 of the deployment guide. Restrict-by-default is preserved if anyone later adds Share-with-link permissions by accident.

---

## 📥 Added YYYY-MM-DD — _new tasks land below this line_

> New task specs the planner appends here. Each block follows the same shape:
> 1. **Task Board row to add** (just the markdown row — Kilo copies it into the board above).
> 2. **Root cause / rationale.**
> 3. **Fix / spec** — file list, exact changes, expected behavior.
> 4. **Result** — what "done" looks like.

---

## 📥 Added 2026-09-06 — T35 (Fix: server dedupe guard blocks user-approved overrides)

> **Status: planning — awaiting user confirmation.** User's report: "when find the duplicate, if the teacher click 仍然提交, the google sheet did not show the new record".

### Root cause / rationale

After T33 + T34, the duplicate flow works like this:

1. Teacher enters a school name already in the Sheet.
2. `#duplicateModal` appears with 取消 / 仍然提交 (variant B: 返回核對 / 仍然提交).
3. Teacher clicks 仍然提交.
4. Client calls `performSubmit(formData)` → `fetch(URL, { mode: 'no-cors', body: JSON.stringify(formData) })`.
5. **Server-side `doPost()` detects the duplicate** (T33's defense-in-depth guard) → returns `{ok: false, reason: 'duplicate'}` → **no row appended**.
6. But the client uses `mode: 'no-cors'` → response is opaque → client **can't read** the rejection → success modal still shows.
7. Teacher sees "submission accepted" but the Sheet has no new row → confusion.

The server-side guard is correct for catching bypassed client checks (e.g. someone calling the API directly), but it has **no way to know** the teacher has explicitly approved an override via the modal. The soft-block semantics break at this seam.

### Fix / spec

Pass a `forceSubmit` flag in the request body. Server-side guard only rejects when `forceSubmit !== true`. Client sets `forceSubmit: true` only in the `仍然提交` callback.

**`apply.html` changes (~5 lines):**

1. In the submit handler where `formData` is built, add a default `forceSubmit: false`:
   ```javascript
   const formData = {
       appId: ...,
       ...,
       forceSubmit: false
   };
   ```
2. In `showDuplicateModal`'s `proceed` callback (currently `() => performSubmit(formData)`), set the flag before re-firing:
   ```javascript
   const proceed = () => { close(); if (onProceed) { formData.forceSubmit = true; onProceed(); } };
   ```
3. That's it — `performSubmit(formData)` and the existing `fetch` body pick up the flag naturally.

**`Code.gs` changes (user to paste + redeploy):**

1. In `doPost()`, change the duplicate guard's reject condition:
   ```javascript
   // Before:
   if (existing && existing === submittedName) {
       return ContentService.createTextOutput(JSON.stringify({ ok: false, reason: 'duplicate' }))
           .setMimeType(ContentService.MimeType.JSON);
   }

   // After:
   if (existing && existing === submittedName && !d.forceSubmit) {
       return ContentService.createTextOutput(JSON.stringify({ ok: false, reason: 'duplicate' }))
           .setMimeType(ContentService.MimeType.JSON);
   }
   ```
2. **Email marker for overrides** — so secretariat can identify intentionally-overridden submissions in their inbox:
   ```javascript
   var subject = (d.forceSubmit ? '[重複] ' : '') + '新學校報名：' + d.schoolNameCn;
   MailApp.sendEmail(
     'marketing@hkata.space',
     subject,
     d.schoolNameCn + ' (' + d.appId + ') 已提交報名。' +
     ...
     (d.forceSubmit ? '\n（注意：此為重複提交 — 用戶已於表單確認覆核）' : '')
   );
   ```
   Sheet rows themselves are unchanged — the `[重複]` marker lives only in the email subject/body so secretariat can grep their inbox.

### Files touched at implementation time

- `apply.html` — 2 small edits (default `forceSubmit: false` in formData + set to true in proceed callback).
- `Code.gs` (Apps Script) — 2 small edits (guard condition + email subject/body marker). User to paste + redeploy as new version.
- `.kilo/plans/REVAMP_PLAN_V3.md` — T35 → ✅ DONE + worklog entries.

### Result — what "done" looks like

1. Submit a school already in the Sheet → duplicate modal appears (T33+T34).
2. Click **返回核對** → modal closes, no POST, no row. (Same as today — no regression.)
3. Click **仍然提交** → modal closes, POST fires with `forceSubmit: true`, **server appends row**, success modal shows. **Sheet has the new row within a few seconds.**
4. Submit a new school (no dupe) → no modal, success modal as before.
5. `marketing@hkata.space` inbox: an override submission's email subject is `**[重複] 新學校報名：[name]**`; body ends with `（注意：此為重複提交 — 用戶已於表單確認覆核）`. Easy to filter.
6. Direct `curl` POST to `/exec` with `{schoolNameEn: 'X', ...}` (no `forceSubmit`) → server returns `{ok:false, reason:'duplicate'}` → no row. Defense-in-depth preserved for bypasses.
7. Direct `curl` POST with `forceSubmit: true` → row appended (only if secretariat reviews the email marker they can spot the override).

---

## 📥 Added 2026-09-06 — T39 (Reorder track sections on primary + secondary)

> **Status: planning — awaiting user confirmation.** User's report: "in primary and secondary page, please move this part [TRACK 01 太空任務標誌設計] after 航天 AI 創新大賽 [TRACK 02 AI 工程]".

### Current vs desired order

**primary.html** (3 tracks):
- Current: `TRACK 01 太空任務標誌設計` → `TRACK 02 航天 AI 創新大賽 · 未來月球基地` → `TRACK 03 中國航天發展演講比賽`
- Desired: 太空任務標誌設計 moves to AFTER 航天 AI 創新大賽 → `TRACK 02 航天 AI 創新大賽` → `TRACK 01 太空任務標誌設計` → `TRACK 03 中國航天發展演講比賽`

**secondary.html** (2 tracks):
- Current: `TRACK 01 太空任務標誌設計` → `TRACK 02 航天 AI 創新大賽 · 未來火星基地`
- Desired: `TRACK 02 航天 AI 創新大賽` → `TRACK 01 太空任務標誌設計`

The TRACK labels themselves are user-visible chips ("TRACK 01", "TRACK 02", "TRACK 03") — three different reorder behaviors are possible. **Pick one**:

### Variant A — Reorder blocks only, keep TRACK labels as-is

```
primary.html:
  TRACK 02 [AI 工程 航天 AI 創新大賽 · 未來月球基地]    (label stays "TRACK 02")
  TRACK 01 [太空任務標誌設計]                         (label stays "TRACK 01")
  TRACK 03 [中國航天發展演講比賽]                    (label stays "TRACK 03")
```

Pros: minimal change (move HTML blocks only — chip text + ID + section ID all stay).
Cons: visually confusing — TRACK 02 appears first, then TRACK 01.

### Variant B ★ recommended — Reorder blocks AND renumber labels

```
primary.html:
  TRACK 01 [AI 工程 航天 AI 創新大賽 · 未來月球基地]   (was TRACK 02)
  TRACK 02 [太空任務標誌設計]                         (was TRACK 01)
  TRACK 03 [中國航天發展演講比賽]                    (unchanged)
```

Pros: clean visual order. AI 工程 is the flagship and now reads as TRACK 01. Anchor IDs (`#track-ai`, `#track-logo`, `#track-speech`) stay the same — anchor nav links still work.
Cons: chips change in two places. Section comment text changes ("TRACK 02: AI 工程" → "TRACK 01: AI 工程").

### Variant C — Different rename (標誌 first / AI 工程 second)

```
primary.html:
  TRACK 01 [太空任務標誌設計]                         (no change)
  TRACK 02 [AI 工程 航天 AI 創新大賽 · 未來月球基地]   (was TRACK 02)
  TRACK 03 [中國航天發展演講比賽]                    (unchanged)
```

Pros: nothing to change.
Cons: **doesn't match user's request** — they explicitly said to move 太空任務標誌設計 AFTER 航天 AI 創新大賽. Listed only for completeness.

### Files touched at implementation time

- `primary.html` — reorder 3 track `<section>` blocks (variant B requires also updating the chip text + HTML comments).
- `secondary.html` — reorder 2 track `<section>` blocks (variant B requires also updating the chip text + HTML comments).
- `.kilo/plans/REVAMP_PLAN_V3.md` — T39 → ✅ DONE + worklog entry.

### Result — what "done" looks like

1. Hard-refresh `primary.html` → page now reads: AI 工程 (航天 AI 創新大賽) first, 太空任務標誌設計 second, 中國航天發展演講比賽 third.
2. Hard-refresh `secondary.html` → AI 工程 (航天 AI 創新大賽) first, 太空任務標誌設計 second.
3. Anchor nav still works (IDs unchanged in variant A/B; chips/text change in variant B).
4. Alternating section backgrounds (`section-y` / `surface-alt`) preserved — may need to flip which sections get which background so the alternation still works after reorder.

---

## 📥 Added 2026-09-06 — T40 (Add 「比賽章程」 section to primary.html — 7 chapters)

> **Status: planning — awaiting user confirmation on 3 design choices below.** User's request: paste a 7-chapter 章程 block into the primary prospectus page. Spec: new single `<section id="charter">` between the existing `#key-dates` section and the BIG APPLY CTA.

### Root cause / rationale

Today the primary prospectus page (`primary.html`) covers the 3 tracks + key dates + apply CTA, but the **official 7-chapter 章程** (background, eligibility, events, judging, schedule, awards, learning support) only lives in the V2 plan as raw text — never on the live site. Teachers who want the full rule book currently have to ask the secretariat. The user is providing the canonical 7-chapter copy and asking for it added as a self-contained, well-structured section so the page works as a complete prospectus (everything a teacher needs in one place).

### Scope

**One file:** `primary.html` only. Secondary / kindergarten get their own targeted prospectus content later (not in this task). All 7 chapters render from the user's exact text — no paraphrase, no addition.

### Fix / spec — proposed layout

```
[TOP ANCHOR NAV  ← add one new link]
  本頁內容   TRACK 02 AI 工程   TRACK 01 標誌   TRACK 03 演講   重要日子   比賽章程   ← (new)

[NEW <section id="charter" class="section-y">]

  ┌──────────────────────────────────────────────────────────┐
  │  eyebrow: "Competition Rules · 比賽章程"                 │
  │  h2: 七個章節 · 完整賽事資訊                              │
  │  sub-line: 七個章節涵蓋活動背景、參賽對象、賽事項目、      │
  │            評審準則、比賽日程、獎項獎勵、學習支援平台      │
  └──────────────────────────────────────────────────────────┘

  [STICKY SUB-NAV — design choice A]   ← only inside this section
    一、背景 · 二、對象 · 三、項目 · 四、評審 · 五、日程 ·
    六、獎項 · 七、支援

  ╔══════════════════════════════════════════════════════╗
  ║  CHAPTER 1 — 一、活動背景與宗旨                     (id=ch-1)
  ║  • 活動背景 paragraph                                ║
  ║  • 活動願景 paragraph                                ║
  ║  • 核心宗旨 paragraph                                ║
  ╚══════════════════════════════════════════════════════╝
  ╔══════════════════════════════════════════════════════╗
  ║  CHAPTER 2 — 二、參賽對象                            (id=ch-2)
  ║  • 全港小學學生 (highlight)                          ║
  ║  • 初小 / 高小 分流說明                              ║
  ╚══════════════════════════════════════════════════════╝
  ╔══════════════════════════════════════════════════════╗
  ║  CHAPTER 3 — 三、賽事項目及主題                      (id=ch-3)
  ║  4 sub-track cards (grid — design choice B):         ║
  ║   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────┐ ║
  ║   │全校 標誌+  │ │ 初小 演講  │ │ 高小 AI    │ │跨級│ ║
  ║   │填色       │ │            │ │            │ │藍圖│ ║
  ║   │chip:全校參與│ │ chip:初小  │ │ chip:高小  │ │    │ ║
  ║   └────────────┘ └────────────┘ └────────────┘ └────┘ ║
  ╚══════════════════════════════════════════════════════╝
  ╔══════════════════════════════════════════════════════╗
  ║  CHAPTER 4 — 四、評審準則與展示形式                   (id=ch-4)
  ║  Two columns (2 cards):                              ║
  ║   ┌─────────────────┐ ┌─────────────────┐             ║
  ║   │ 航天 AI 創新大賽  │ │ 未來基地概念藍圖 │             ║
  ║   │ 30% 創新, 20% AI │ │ 30% 創意視野     │             ║
  ║   │ 15% 問題定義 ... │ │ 30% 解難 ...     │             ║
  ║   └─────────────────┘ └─────────────────┘             ║
  ╚══════════════════════════════════════════════════════╝
  ╔══════════════════════════════════════════════════════╗
  ║  CHAPTER 5 — 五、比賽日程                              (id=ch-5)
  ║  Vertical timeline (design choice C) — 7 stages:     ║
  ║   ●─── 2026/09–10  招募 (30px dot)                    ║
  ║   ●─── 2027/01/11  啟動禮                              ║
  ║   ●─── 2027/01–03  創新研發                            ║
  ║   ●─── 2027/03/31  作品提交 ← dot is gold (milestone) ║
  ║   ●─── 2027/04/30  半決賽                              ║
  ║   ●─── 2027/05 中    總決賽 (gold milestone)           ║
  ║   ●─── 2027/06      衛星發射 (gold milestone)          ║
  ╚══════════════════════════════════════════════════════╝
  ╔══════════════════════════════════════════════════════╗
  ║  CHAPTER 6 — 六、獎項及獎勵                            (id=ch-6)
  ║  2-card grid (left card = prize levels, right card =   ║
  ║  School Space Logo Plate + 冠軍作品升空):              ║
  ║   ┌─────────────┐ ┌─────────────────┐                 ║
  ║   │ 一/二/三/   │ │ School Space    │                 ║
  ║   │ 優異/創意  │ │ Logo Plate (全) │                 ║
  ║   │ + 公眾投票 │ │ 冠軍作品升空     │                 ║
  ║   └─────────────┘ └─────────────────┘                 ║
  ╚══════════════════════════════════════════════════════╝
  ╔══════════════════════════════════════════════════════╗
  ║  CHAPTER 7 — 七、學習支援平台                          (id=ch-7)
  ║  N.O.R.A. Kids — 星際 AI 學院 APP                     ║
  ║  Reference V3 T18 plan note: app is **即將推出**,      ║
  ║  not yet live — keep copy honest, no fake App Store   ║
  ║  button. Use the existing index.html "即將推出"         ║
  ║  email-notify pattern as visual cue.                   ║
  ╚══════════════════════════════════════════════════════╝
```

### Token discipline (reuse existing classes)

- `.section-y` for vertical padding
- `.surface-alt` for alternating bg between chapter cards (1, 3, 5, 7 vs 2, 4, 6)
- `.card` for chapter containers
- `.chip` / `.chip-k` / `.chip-p` for sub-track category badges
- `.eyebrow` / `.h2` / `.h3` / `.body` / `.caption` for typography
- Existing `.btn-ghost` for the top-nav "比賽章程" link
- For the vertical timeline: reuse the `.timeline` pattern from `index.html` (`#schedule`)

### Open design choices — awaiting user confirmation

| # | Choice | Default (recommended) | Alternative |
|---|---|---|---|
| **A** | **Sticky sub-nav inside 章程 section** | **Yes** — pins below the page header while reading the section, lifts after exiting | No — inline at top of section (scrolls away, user loses context) |
| **B** | **§三 (4 sub-tracks) grid** | **2-col on desktop** (matches prospectus design language, room for paragraph copy under each card) | 4-col on desktop (matches the homepage 3 group cards but each sub-track has more copy — cards get cramped) |
| **C** | **§五 schedule visualization** | **Vertical timeline** with dots + connecting line (reuses the index.html `#schedule` pattern; milestones in `--gold-300`) | Horizontal 7-step pill row (matches the existing hardware lottery flow but 7 steps is too many for one row on mobile) |

### Files touched at implementation time

- `primary.html` — add 1 link to top anchor nav + new `<section id="charter">` with sub-nav + 7 chapters (~200 lines of markup). No JS change needed (existing anchor scroll works).
- `assets/theme.css` — only IF a new class is needed (e.g. a chapter-card spacing rule). Likely reuses `.card` directly. Conditional.
- `.kilo/plans/REVAMP_PLAN_V3.md` — T40 → ✅ DONE + worklog entry.

### Result — what "done" looks like

1. `primary.html` top nav has 6 links now: 本頁內容 · TRACK 02 AI · TRACK 01 標誌 · TRACK 03 演講 · 重要日子 · **比賽章程** (new).
2. Clicking 比賽章程 jumps to `#charter` section, the sub-nav appears.
3. While scrolling the 章程 section, the sub-nav sticks (variant A) so 一–七 are always one click away.
4. 7 chapters render with the user's exact text, each with Roman-numeral heading.
5. §三 shows 4 sub-track cards in a 2-col grid (variant B), each with chip badge (全校參與 / 初小 / 高小 / 跨小學級別) + paragraph.
6. §四 shows two judging-criteria cards side-by-side.
7. §五 shows a 7-stage vertical timeline with milestone dates highlighted in gold.
8. §六 shows a 2-card layout (prize levels + Logo Plate / 升空).
9. §七 references N.O.R.A. Kids with a "即將推出" note matching the index.html honesty rule (no fake store buttons).
10. The hard-refresh renders correctly; section background alternates between `surface-alt` and base; chip colors match the existing `--group-k` / `--group-p` / `--group-s` for the segments.

---

## 📥 Added 2026-09-06 — T41 (Rework T40: move 章程 above TRACK 02 + redesign chapter UI)

> **Status: planning — awaiting user pick on the redesign variant.** User reviewed the T40 render and asked for: (1) move the 章程 section from "after KEY DATES" to **"before TRACK 02 AI 工程"** so the chapter overview reads first; (2) **redesign the chapter UI** — current card-per-chapter approach feels heavy.

### Two changes

#### Change 1 — Placement (clear, no design choice)

**Current order** in `primary.html`:
```
hero → anchor-nav → TRACK 02 AI → TRACK 01 標誌 → TRACK 03 演講 → KEY DATES → 章程 → BIG APPLY CTA
```

**New order** (user request):
```
hero → anchor-nav → 章程 → TRACK 02 AI → TRACK 01 標誌 → TRACK 03 演講 → KEY DATES → BIG APPLY CTA
```

Mechanics: cut the existing `<section id="charter">` block + paste it just before `<section id="track-ai">` (TRACK 02). Top anchor-nav link stays. KEY DATES section stays in its position.

#### Change 2 — UI redesign (open — pick a variant)

The T40 design used `.card` per chapter, which felt heavy. Below are 3 redesign options for the 7 chapters (— same content, new look):

### Variant A ★ recommended — 「Document-style flowing chapter blocks」

Each chapter rendered as a flow block (no `.card` wrapper), separated by thin top borders (`border-t border-[var(--border-soft)]`). Each chapter has:

```
┌─────────────────────────────────────────────────────────┐
│   ┌────────┐                                             │
│   │  一、   │   活動背景與宗旨                  ← chapter h2  │
│   │  80px  │   ─────────────────────                      │
│   │ big nu │   活動背景                              ← label  │
│   │  metric │   本賽事為香港回歸 30 周年…                │
│   │  (gold) │                                            │
│   └────────┘   活動願景                              ← label  │
│               打造香港首屈一指…                       │
│                                                         │
│               核心宗旨                              ← label  │
│               透過真實任務導向…                       │
└─────────────────────────────────────────────────────────┘
```

- Left-side big Roman numeral as a decorative **giant character** (`text-7xl font-display text-[var(--gold-500)]`) — visual anchor for each chapter
- 3-column flex on desktop: `[big numeral | chapter title + meta | content]` or stacked on mobile
- No card wrapper → looks like a printed PDF
- Section dividers between chapters (not background alternation)
- Sub-track cards (§三) keep the 2-col grid (those work fine as cards)
- Judging criteria cards (§四) keep 2-col cards
- Timeline (§五) stays
- Awards grid (§六) keeps 2-col cards
- APP card (§七) stays

**Pros:** official-document feel; lighter visual weight; Roman numerals as decoration reinforce the "official rules" tone.
**Cons:** less modular — harder to add/remove a chapter later.

### Variant B — Compact card-grid preserved (lighten only)

Keep the card-per-chapter structure from T40, but:
- Reduce padding from `p-6 sm:p-8` → `p-5 sm:p-6`
- Tighter gap between cards (`space-y-4` instead of `mb-6` on each)
- Move sub-labels (活動背景/願景/宗旨) into the same paragraph with a `<strong>` instead of a separate caption line
- Reduce the Roman numeral size from `text-2xl` → `text-lg` so it doesn't dominate

**Pros:** minimal change, preserves modularity.
**Cons:** doesn't really "redesign" — just tightens.

### Variant C — 2-col TOC sidebar

Convert the sticky horizontal sub-nav into a sticky **vertical sidebar** on desktop:

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────────┬───────────────────────────────┐  │
│  │ 章程導航 (sticky) │ 一、活動背景與宗旨          │  │
│  │ 一、背景 ●       │ ─────────────────────       │  │
│  │ 二、對象         │ 活動背景                      │  │
│  │ 三、項目         │ 本賽事為香港回歸 30 周年…    │  │
│  │ 四、評審         │                                │  │
│  │ 五、日程         │ 活動願景                      │  │
│  │ 六、獎項         │ 打造香港首屈一指…            │  │
│  │ 七、支援         │                                │  │
│  └──────────────────┴───────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

- Left sidebar: 200px wide, sticky, vertical list with active state highlighting as user scrolls
- Right main column: chapter content
- On mobile: sidebar collapses into a horizontal sticky scroll-list (like current design)

**Pros:** classic long-doc layout, professional look, clear hierarchy.
**Cons:** requires a 2-col grid layout + new sidebar styling (small CSS addition); less compact on tablet widths.

### Files touched at implementation time

- `primary.html` — cut + paste the `<section id="charter">` block (mechanical move); redesign markup changes per chosen variant.
- `assets/theme.css` — only if variant C chosen (sidebar styles). A and B are pure HTML.
- `.kilo/plans/REVAMP_PLAN_V3.md` — T41 ✅ DONE + worklog entry.

### Result — what "done" looks like

1. Hard-refresh `primary.html` → the page now reads: hero → anchor-nav → **章程 (7 chapters, new design)** → TRACK 02 AI → TRACK 01 標誌 → TRACK 03 演講 → KEY DATES → BIG APPLY CTA.
2. The 7 chapters render with the new design (per chosen variant).
3. Top anchor nav still has 6 links including 「比賽章程」.
4. Sticky sub-nav still works (if A/B/C all keep it; only C relocates it to a vertical sidebar).

---

## 📥 Added 2026-09-06 — T34 (Refine duplicate-modal warning copy + button labels)

> **Status: planning — awaiting user confirmation on button-label variant.** User's request: "now have an issue, if duplicated, no warning, the teacher will never know if he can apply or not. … i do not want Soft or Hard, but Soft, but add a warning like 'the school applied already, please check again and submit again'".

### Root cause / rationale

T33's `#duplicateModal` currently says:

```
此學校已登記
秘書處記錄顯示，[name] 已經有報名紀錄。
如需更改資料或查詢，請電郵秘書處 marketing@hkata.space。
[取消]  [仍然提交]
```

This **reads** as "school already registered → contact the secretariat" — too passive. The teacher can't easily tell whether they should *stop* or *re-confirm and submit again*. User wants a more **directive** copy that explicitly walks the teacher through the decision: "school already applied → check name carefully → either correct it or proceed to submit again". Behavior stays soft-block (cancel = exit, proceed = submit again); only the **copy** changes.

### Fix / spec

**Scope of change:** `apply.html` `#duplicateModal` body text + button labels only. No CSS change (existing `.modal-icon-warn` / `.modal-body` / `.modal-sub` / `.modal-actions` classes are sufficient). No Apps Script change. No new row in the Sheet.

**New modal body (text-only swap inside `#duplicateModal`):**

```
[warn icon - gold]
此學校已申請過

[school name in gold pill] 已於本系統登記。

請先再次核對學校名稱是否正確：
  • 如屬輸入錯誤，請按「返回核對」並修改學校名稱
  • 如確認資料正確並需要重新提交（例如更新聯絡人資料），請按「仍然提交」

如有疑問，請電郵秘書處 marketing@hkata.space

[返回核對]  [仍然提交]
```

Key changes vs current:
- Heading: `此學校已登記` → **`此學校已申請過`** — past tense, more direct.
- Echoed name: still in a `<strong>` styled with `text-[var(--text-hi)]` (no separate pill — keeps it simple).
- New body line: "**請先再次核對學校名稱是否正確**" — explicit "check again" instruction matching the user's literal request.
- Two bulleted outcomes make the decision crystal clear.
- Existing `mailto:marketing@hkata.space` line kept as the safety valve.

### Open design choice — button labels

| # | Variant | Cancel button | Proceed button |
|---|---|---|---|
| **A** | **Keep current labels** | 取消 | 仍然提交 |
| **B** | **Rename cancel for clarity** (recommended) | **返回核對** | 仍然提交 |

Variant B (recommended) makes the cancel button more action-oriented — "返回核對" tells the teacher exactly what will happen (return to the form to verify), instead of the generic 取消 which can feel like "give up entirely".

### Files touched at implementation time

- `apply.html` — replace the `#duplicateModal` body content only (~12 lines). The opening/closing div, icon, IDs, classes all stay. No JS change.
- `assets/theme.css` — no change.
- `Code.gs` (Apps Script) — no change.
- `.kilo/plans/REVAMP_PLAN_V3.md` — T34 → ✅ DONE + worklog entry.

### Result — what "done" looks like

1. Hard-refresh `apply.html` (`Cmd+Shift+R`).
2. Submit a school already in the Sheet.
3. Duplicate modal appears with new copy:
   - Heading **「此學校已申請過」**
   - Echoed school name
   - "請先再次核對學校名稱是否正確" + two bulleted outcomes
   - Two buttons: **返回核對** / **仍然提交** (variant B) or 取消 / 仍然提交 (variant A)
4. Click 返回核對 / 取消 → modal closes, focus returns to 學校英文全稱 field, no POST.
5. Click 仍然提交 → modal closes, POST fires, success modal appears.

---

## 📥 Added 2026-09-06 — T33 (Duplicate-check via 學校英文全稱)

> **Status: planning — awaiting user confirmation on 3 design choices below.** User's request: "i want to add a check before submit the application, please see it work, plan before implement. i think the most easy to de-duplicate is via 學校英文全稱."

### Root cause / rationale
Today every successful submission appends a row to `Registrations`. Nothing prevents the same school from being registered twice (same teacher filling the form on different days, or two teachers from the same school submitting independently). For a school-level competition, one row per school is the right invariant — duplicates distort 抽籤 / kit lottery / certificate delivery.

**Dedupe key: 學校英文全稱** (column D in the Sheet).
- Stable across format variants (less ambiguous than Chinese names which can use Traditional/Simplified/校/學校 variants).
- Lowercase + trim normalization catches accidental capitalization differences.
- Already validated to be non-empty in the form.

### Fix / spec

**Architecture — server-side check + client-side warning, defense-in-depth.**

1. **Apps Script — add `doGet(e)`** alongside the existing `doPost(e)`. Reads `Registrations!D2:D`, lowercases + trims each, returns:
   ```json
   { "count": 42, "names": ["st. paul's college", "hong kong baptist university", "..."] }
   ```
   Privacy: returns **only normalized names**, no appIds, no other PII. Apps Script Web App with `Access: Anyone` natively supports CORS on `doGet` so the client can read the JSON directly.

2. **Apps Script — `doPost(e)` duplicate guard.** Before `appendRow()`, scan column D for the same normalized value. If found, return `ContentService.createTextOutput(JSON.stringify({ok:false, reason:'duplicate'}))` with HTTP 409. New registration rejected server-side as last line of defense.

3. **`apply.html` — pre-load + cache on page load.**
   ```javascript
   const resp = await fetch('YOUR_EXEC_URL', { method: 'GET' });
   const { names } = await resp.json();
   const knownNames = new Set(names);
   sessionStorage.setItem('hkata_known_names', JSON.stringify([...knownNames]));
   ```
   - Use `sessionStorage` (per-tab) — refresh within same tab = no re-fetch.
   - If `doGet` fails: silently skip the client check, rely on server-side.

4. **`apply.html` — pre-submit check.**
   ```javascript
   const norm = (s) => (s || '').trim().toLowerCase();
   if (knownNames.has(norm(formData.schoolNameEn))) {
     showDuplicateModal(formData.schoolNameEn);  // soft-block
     return;
   }
   // else: continue with the POST as today
   ```

5. **`apply.html` — duplicate modal.**
   - Reuse `.modal-backdrop` / `.modal` tokens.
   - Content: ⚠ icon, **「此學校已登記」**, echoes the entered name, sub-line "如需更改資料或查詢，請電郵秘書處 marketing@hkata.space", **取消** (ghost) + **仍然提交** (primary) buttons.
   - **取消** → close modal, focus `#schoolNameEn`, no POST.
   - **仍然提交** → close modal, continue POST + success modal.

6. **Server-side guard visible client-side.** If user manages to bypass the client check (e.g. devtools) and `doPost` returns `{ok:false, reason:'duplicate'}` — the existing `mode:'no-cors'` makes the response opaque so we can't read it. Mitigation: trust that the server *appended nothing* (true), and show the success modal as today. The hidden dup just won't exist in the Sheet. (If `mode:'cors'` becomes viable later, we can wire a proper "已拒絕" message.)

### Open design choices — awaiting user confirmation

| # | Choice | Default (recommended) | Alternative |
|---|---|---|---|
| **A** | **Soft vs hard block on duplicate** | **Soft** — show modal with Cancel + 仍然提交. Lets a teacher correct a typo and re-submit without secretariat intervention. | Hard — only Cancel + a `mailto:marketing@hkata.space` link. Stricter but worse UX when the dupe is a genuine re-attempt (e.g. teacher changed schools, wants to update the responsible person). |
| **B** | **One-key (English only) vs two-key (English + Chinese)** | **One-key (English only)** — simpler, lower false-positive risk, matches user's exact request. | Two-key — also dedupes on 學校中文全稱, catches the rare case where two schools happen to share an English name. Adds complexity and Chinese-name normalization rules. |
| **C** | **Surface existing appId in the duplicate modal** | **No** — privacy-by-default, no info-leak about prior submissions. Teacher can email secretariat for their appId (footer has `marketing@hkata.space`). | Yes — show existing appId as a pill in the modal so the teacher can immediately know their prior reference. Convenient but surfaces another school's appId to anyone using the form on that browser. |

### Result — what "done" looks like

1. Refresh `apply.html`: page calls `doGet`, stores known-name Set in `sessionStorage`. No visible UI difference.
2. Submit a school that's already in the Sheet → duplicate modal appears with the entered name + Cancel + 仍然提交.
3. Click **取消** → modal closes, focus returns to 學校英文全稱 field, no POST, no row in Sheet.
4. Click **仍然提交** → modal closes, POST fires, success modal appears. (Server-side guard is also in place — but with soft-block, this path is intentional.)
5. Submit a new school (case-insensitive trim match against the cached list) → no duplicate modal, success modal as today.
6. Direct `curl` to `/exec` POSTing a duplicate name → server returns `{ok:false, reason:'duplicate'}`, NO row appended.
7. DevTools → block the `doGet` URL → first load, client check is silent-skip; submission still goes through; server-side guard rejects if it's actually a duplicate.
8. V3 housekeeping: T33 → ✅ DONE + 2 worklog entries (planning + implementation).

### Files touched at implementation time

- `Code.gs` (the Apps Script project the user owns) — add `doGet()` + add duplicate guard to `doPost()` → redeploy as new version
- `apply.html` — fetch on load + cache + pre-submit check + duplicate modal markup + handler
- `assets/theme.css` — only if a new icon/color variant is needed (likely reused `.btn-ghost` + `.btn-primary`, no new CSS)

---

_(nothing added yet)_
