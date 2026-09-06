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
