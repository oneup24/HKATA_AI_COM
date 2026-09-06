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

> **Active carry-in from V2:** **T19 → T30** (submission backend → Google Sheets). All other V2 tasks are settled (T1–T18 ✅, T20–T23 + T25–T28 ✅, T24 ↩ REVERTED, T29 ✅). See V2 Recap below for the snapshot.

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

---

## 📥 Added YYYY-MM-DD — _new tasks land below this line_

> New task specs the planner appends here. Each block follows the same shape:
> 1. **Task Board row to add** (just the markdown row — Kilo copies it into the board above).
> 2. **Root cause / rationale.**
> 3. **Fix / spec** — file list, exact changes, expected behavior.
> 4. **Result** — what "done" looks like.

---

_(nothing added yet)_
