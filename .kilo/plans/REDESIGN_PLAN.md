# Homepage Redesign Plan — HKATA「航天築夢」AI 創新大賽

Source of truth: `/Users/user/Downloads/全港首屆中小學「航天築夢」航天AI創新大賽 (1).pdf` (24 pages) and current `index.html`.

---

## 1. Goals & Constraints (from the brief)

| # | Requirement | Implication for homepage |
|---|---|---|
| 1 | Information architecture with competition, registration, timeline | Reorganize page into named, scannable sections; persistent anchor nav. |
| 2 | Hero with **3 prominent CTA blocks** — Kindergarten / Primary / Secondary | Hero grows from "single CTA" to a **3-card segmented Hero**. |
| 3 | **No granular Engineering Track detail** on homepage; high-level only | Replace the current Hardware-Kits deep-dive with a single condensed "Tracks at a Glance" strip that links out. |
| 4 | Judging panel section **without names**; focus on expertise/criteria | Replace the named juror copy with an anonymized "Mission Command / Review Standards" panel using the official scoring rubric. |
| 5 | Clear timeline & milestones | Promote timeline to a top-level, fixed-position "Schedule" section with date pills + status. |
| 6 | Visual hierarchy + UX for students/parents/educators | Dual-language micro-copy, big numbers, age-appropriate icons, and sticky "Register" + "Public Vote" actions. |

---

## 2. New Information Architecture (one-page IA)

```
HEADER (sticky)
  ├─ Logo · HKATA
  ├─ Anchor nav: 比賽概覽 | 組別賽道 | 賽事日程 | 評審準則 | 獎項與成果
  └─ Persistent actions: 學校報名 (primary)

01 HERO  ── Competition tagline + 3 group CTAs (K / P / S)
02 AT-A-GLANCE  ── 4 number tiles + 4 organizer logos strip
03 TRACKS DIRECTORY  ── 3 cards (high level only, no hardware list)
04 GROUP-FOCUSED PATHWAY  ── 3 columns K/P/S "我適合甚麼比賽?" recommender
05 JUDGING & STANDARDS  ── rubric donut + criteria, anonymous panel
06 TIMELINE  ── horizontal milestones with date pills & status
07 AWARDS  ── 2-3 benefit tiles (scholarship + exhibition)
08 ECOSYSTEM  ── N.O.R.A. Kids App learning platform
09 ORGANIZERS & PARTNERS  ── logo wall
FOOTER  ── Contact, secretariat, social
```

Notes:
- Remove current deep-dive `#hardware` section (per req. #3).
- Promote a new "Awards" section (currently buried in timeline copy).
- Keep the Starfield visual identity but reduce its weight to let content breathe.
- **Excluded from homepage scope (per user instruction):** 公眾投票 (Public Voting), 升空 (Launch-to-Space) features, and 未來基地概念藍圖大賽 (Future Base Blueprint Competition). These will not be promoted, linked, or featured on the homepage. The homepage focuses on registration, judging, schedule, and on-Earth student awards/recognition.

---

## 3. Section-by-Section Layout

### 3.1 Header (sticky, transparent → solid on scroll — keep current)
- Logo + bilingual wordmark (already present).
- Anchor links (Traditional Chinese only):
  比賽概覽 · 組別賽道 · 賽事日程 · 評審準則 · 獎項與成果
- Right side: 學校報名 (gradient — orange/red, the existing CTA style).

### 3.2 HERO — "為夢啟航,築夢太空"
Layout: full-bleed nebula background, headline left, **three card CTAs right** on desktop; stacked on mobile.

- **Eyebrow pill**: 香港回歸30周年 · 教育局「心繫家國」聯校活動 (new — adds authority).
- **H1**: 築夢太空創未來 / 探索宇宙新想像 (keep existing).
- **Sub**: 結合航天工程、人工智能與創新思維。2026–2027 年度全港中小學及幼稚園航天 AI 創新盛事。
- **Three CTA cards** (req. #2) — each card is a glass-panel tile, hovers reveal an arrow + "查看組別詳情":

  | Card | Color accent | Icon | Title | Sub-label | Target |
  |---|---|---|---|---|---|
  | 幼稚園組 | Cyan #00F2FE | fa-palette | 太空任務標誌設計 + 太空基地填色 | 毋須編程 · 校內學生皆可參與 | `track03.html` |
  | 小學組 | Blue #4FACFE | fa-rocket + fa-microphone | 標誌設計 · 演講比賽 · AI 工程挑戰 (高小) | 小一至小六 · 多元任務 | track01/03/04 |
  | 中學組 | Purple #A855F7 | fa-satellite + fa-microchip | AI 太空工程挑戰 (初中/高中) | 初/高中分流 · 配備官方硬件套件 | track01 |

  Each card carries: 對象年級, 核心任務一句話, 一顆「推薦賽道」chip, and a primary action "立即報名 / 查看細則".

- **Trust strip under cards**: 主辦機構 row (教育局 · 心繫家國 · SPSC · HKSSSC · HKATA) using their logos.

### 3.3 AT-A-GLANCE — "比賽目標"
Replace current three "stat cards" with a richer band:
- 4 number tiles: `>300 學校` · `>1,000 隊伍` · `>20,000 學生` · `>300+ 幼兒參與`.
- Add a one-line mission: 慶祝特區成立30周年重點項目.

### 3.4 TRACKS DIRECTORY — "三大賽事組別" (high-level only — req. #3)
Replace the current 4-card list with a **pure track summary**, no engineering detail:

1. **太空任務標誌設計 + 太空基地填色** — 全港學校 · 毋須編程 · 校內學生皆可參與
2. **中國航天發展演講比賽** — 小一至小三 · 配合官方航天模型 · 3 分鐘演說
3. **航天 AI 創新大賽** — 高小至高中 · 抽籤分配官方硬件 · AI 工程原型

> Engineering Track detail (CubeSat, Rover, 3D 火箭, 智能機械手, 太空種植, E28) lives only inside `track01.html`. On the homepage we add a single sentence: "高小至高中組可獲大會提供七大航天硬件套件，詳見 Track 01。" plus one inline link.

### 3.5 GROUP-FOCUSED PATHWAY — "我適合甚麼比賽?" (NEW)
A row-per-group matrix answering "I am a K/P/S — what should I enter?" to reduce bounce:

|  | 標誌設計/填色 | 演講 | AI 工程 | 提交作品 |
|---|---|---|---|---|
| 幼稚園 | ✓ | — | — | 校內 1 個優勝 |
| 小學初小 | ✓ | ✓ (P1–P3) | — | 海報+原型 |
| 小學高小 | ✓ | — | ✓ (CubeSat / E28 / 種植) | 海報+原型 |
| 中學初中 | ✓ | — | ✓ (CubeSat / Rover / 3D火箭) | 海報+原型 |
| 中學高中 | ✓ | — | ✓ (Rover / 智能機械手) | 海報+原型 |

This single matrix replaces 200+ words of text and serves parents and teachers directly.

### 3.6 JUDGING & STANDARDS — "評審準則" (req. #4)
- Title: 60% 評分聚焦創新、工程與 AI.
- Donut/radial chart using the official rubric:
  - 創新程度 30% · 工程設計 10% · AI 應用 20% · 問題定義 15% · 科研分析 15% · 原型展示 5% · 簡報及答辯 5%
- "評審重點" panel: 着重創新思維、工程設計及技術可行性，而非作品成本或規模；各組別分開評審。
- Anonymous "Mission Command" panel (replaces named jury):
  - 國家級航天專家 — 工程與航天系統
  - 香港學術權威 — 人工智能與機械人
  - 教育與創科產業代表 — STEM 教學與工程可行性
  - 國家任務總指揮級 — 真實航天任務視野
  - 創新創業導師 — 科研探究與簡報答辯
- Closing callout: 由國家航天英雄、學界泰斗與產業專家三層組成。

### 3.7 TIMELINE — "2026–2027 賽事日程" (req. #5)
Promote current timeline, restructure for clarity:
- **Top strip**: 7 horizontal date pills, each with status badge:
  - ✅ 已完成 · 🔵 進行中 · ⚪ 即將開始 · 🏁 重點里程碑
- **Below**: 2-column grid on desktop, single column mobile. Each item: date · title · description · status.
- **Current dates** (from PDF + current site):
  1. 2026/09/16–10/31 — 全港學校招募 + 各區簡介會 + 教師培訓
  2. 2026/11/16 — 官宣抽籤分組結果
  3. 2027/01/11 — 賽事啟動禮 + 任務與評審準則發布
  4. 2027/01/12–22 — 領取大會硬件套材
  5. 2027/01–03 — 創新研發期（專家巡迴講座、大學參觀、AI工作坊）
  6. 2027/03/31 — 作品截止遞交（研究海報 A0 + 原型示範影片）
  7. 2027/04/30 — 半決賽 (Semi-final)
  8. 2027/05 中 — 總決賽暨創新作品展 (Final Aerospace Fair)
- Add "Add to Calendar" buttons (.ics) per milestone — improves parent/teacher workflow.

### 3.8 AWARDS — "獎項與成果" (NEW prominent section, ground-based only)
2 benefit tiles, focused on scholarships and on-Earth exhibition:
- HKATA 常規課程獎學金 — 持續進修航天及 AI
- 作品展示、獎盃及證書 — 透過 HKATA 及合作機構平台公開展出青年創科成果

Closing line: 每個組別設冠軍、亞軍及季軍。讓青年創科概念走出課堂，啟發同儕與社會。

### 3.9 ECOSYSTEM — N.O.R.A. Kids App
Keep current N.O.R.A. Kids section but tighten, drop voting features:
- App value props (4 bullets): 中國航天科普 · 航天發展歷程 · 航天英雄故事 · 香港科研貢獻
- CTA: 立即下載 App · 家長/老師指南 (secondary, links to PDF guide).

### 3.10 ORGANIZERS & PARTNERS
Logo wall (greyed, equal weight): 教育局 · 心繫家國 · SPSC · HKSSSC · HKATA. Add "策略夥伴" placeholder slots.

### 3.11 FOOTER
Contact secretariat, social, copyright, language toggle.

---

## 4. Content Map (what goes where)

| Source data (PDF) | Homepage section | Detail page |
|---|---|---|
| Vision + 4 tenets (p.6) | Vision strip (after Hero) | About |
| 6 goals (p.7) | Drop or fold into mission strip | About |
| Numbers (p.8) | At-a-glance tiles | About |
| Track topics (p.9) | TRACKS directory + Pathway matrix | Track pages |
| Track 01 Logo (p.10) | Card 1 summary | `track03.html` |
| Track 02 Speech (p.11) | Card 2 summary | `track04.html` |
| Track 03 Engineering (p.13) | Card 3 summary + 1-sentence hardware teaser | `track01.html` (full) |
| N.O.R.A. App (p.14) | Ecosystem section | App subpage |
| Research Poster + Prototype (p.15) | Submission spec under Timeline / Pathway | Submission guide |
| Scoring rubric (p.16) | Judging section | Judging page |
| Jury (p.17) | Anonymized panel | Judging page |
| Timeline (p.18) | Timeline section | Schedule page |
| Prizes — scholarships + exhibition (p.20) | Awards tiles | Awards page |
| Beyond competition (p.21) | Ecosystem & organizers | About |
| Vision long-term (p.22) | Vision strip | About |
| Sponsorship tiers (p.23) | NOT on public homepage; partner page | Partners |

**Excluded from homepage** (per user instruction): 公眾投票 (Public Voting — N.O.R.A. App voting feature), 升空 / To Space (School Space Logo Plate launch, prototype satellite payload, rocket-launch study tour), and 未來基地概念藍圖大賽 (Blueprint Track). These may exist on internal/track pages but are not surfaced on the homepage.

---

## 5. Visual Hierarchy & UX Recommendations

### Visual language
- **Theme**: deep-space (keep current `#060913` + starfield) but reduce starfield density to ~40% of current opacity so text wins the contrast battle.
- **Accent system per group** (apply consistently across CTAs, badges, dividers):
  - 幼稚園: cyan `#00F2FE`
  - 小學: blue `#4FACFE`
  - 中學: purple `#A855F7`
  - 跨組/官方: amber/red gradient (the existing CTA).
- **Typography**: keep Inter + Orbitron. Add a third utility "font-display" for hero numbers.
- **Iconography**: Font Awesome solid; add one custom inline SVG per group (rocket / satellite / palette) for the Hero cards.

### UX micro-improvements
1. **Sticky CTA bar on scroll** (mobile only) — appears after the user scrolls past the Hero with one button: 學校報名. Solves the "where do I tap?" problem.
2. **Audience switcher pill** at top of Hero: 「我是家長 / 老師 / 學生」 — clicking highlights the most relevant group card (others dim).
3. **Countdown timer** above the Hero CTA strip showing days remaining to 2026/10/31 報名截止 (currently implied; make it explicit).
4. **Bilingual micro-copy**: keep primary Chinese, add small English subtitle below each Hero card title (e.g., "Kindergarten · Logo & Colouring").
5. **Persistent anchor nav** in header: 比賽概覽 · 組別賽道 · 賽事日程 · 評審準則 · 獎項與成果 (matches the new IA).
6. **Timeline progressive disclosure**: pills collapse on mobile; tapping a pill expands the card.
7. **"Add to Calendar" CTA** under each timeline item (.ics download) for teachers.
8. **Accessibility**: ensure all glowing elements meet AA contrast on `#060913`. Replace pure white-on-glow where needed.
9. **Loading**: lazy-render N.O.R.A. App mockup + organizer logos below the fold.
10. **SEO/Share**: OpenGraph image updated to show Hero with all 3 group cards + tagline; meta description rewritten to include numbers (>300 schools, >1000 teams).

### Information retrieval aids
- **Glossary tooltip** for first-use jargon: CubeSat, AI 工程挑戰, 原型, 海報 (A0).
- **Search/filter** inside the Pathway matrix (e.g., "只顯示中學") — toggles rows.
- **Download pack CTA**: "下載比賽手冊 (PDF)" — single primary button next to register, drives lead capture.

---

## 6. Implementation Outline (high-level only)

1. **Restructure HTML sections** in `index.html` to the new IA order (Hero → At-a-glance → Tracks → Pathway → Judging → Timeline → Awards → Ecosystem → Organizers → Footer).
2. **Replace named jury copy** in `#jury` with anonymized panel + rubric donut.
3. **Remove / collapse `#hardware` section** and replace with single 1-sentence link to `track01.html`.
4. **Add Hero 3-card CTA block** (the new primary change) with group-color accents and audience switcher.
5. **Promote Timeline** to a horizontal date-pill layout with status badges.
6. **Add Awards section** (currently buried in timeline copy).
7. **Build Pathway matrix** (responsive table → cards on mobile).
8. **Keep the starfield + Tailwind tokens**; only adjust opacity and add 3 group-color tokens.
9. **Re-validate**: ensure all existing pages (`apply.html`, `vote.html`, `track0X.html`) are referenced correctly from the new IA.

No new dependencies. Implementation will be done in a single edit pass on `index.html`.

---

## 7. ASCII Wireframes

### 7.1 Desktop ≥ 1024px

```
┌──────────────────────────────────────────────────────────────────────┐
│ [HKATA]  比賽概覽  組別賽道  賽事日程  評審準則  獎項與成果  [報名]    │  HEADER
├──────────────────────────────────────────────────────────────────────┤
│ ╔════════════════════════════════════╗  ┌───────┐ ┌───────┐ ┌───────┐│
│ ║ [香港回歸30周年 · 心繫家國]        ║  │  🖌️  │ │  🚀  │ │  🛰️  ││  HERO
│ ║                                    ║  │幼兒園│ │ 小學 │ │ 中學 ││
│ ║ 築夢太空創未來                      ║  │ 標誌 │ │ 三項 │ │ AI   ││
│ ║ 探索宇宙新想像                      ║  │ 設計 │ │ 任務 │ │ 工程 ││
│ ║                                    ║  │      │ │      │ │      ││
│ ║ ⏰ 距離報名截止尚餘 24 天           ║  │ 報名 │ │ 報名 │ │ 報名 ││
│ ║ 我是: [家長] [老師] [學生]          ║  └───────┘ └───────┘ └───────┘│
│ ║ [下載比賽手冊 PDF]                  ║  ─ 主辦: 教育局 · 心繫家國 ·   │
│ ╚════════════════════════════════════╝    SPSC · HKSSSC · HKATA ─       │
├──────────────────────────────────────────────────────────────────────┤
│   >300 學校  │  >1,000 隊伍  │  >20,000 學生  │  慶祝回歸30週年       │  AT-A-GLANCE
├──────────────────────────────────────────────────────────────────────┤
│   賽事三大組別                                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                    │
│  │ Track 01    │ │ Track 02    │ │ Track 03    │                    │  TRACKS
│  │ 標誌+填色   │ │ 演講比賽    │ │ AI工程挑戰  │                    │
│  │ 全港學校    │ │ 小一至小三  │ │ 高小至高中  │                    │
│  │ [了解→]     │ │ [了解→]     │ │ [了解→]     │                    │
│  └─────────────┘ └─────────────┘ └─────────────┘                    │
│   高小至高中組可獲七大航天硬件套件  →  詳見 Track 03 (AI工程)         │
├──────────────────────────────────────────────────────────────────────┤
│   我適合甚麼比賽?        filter: [全部] [K] [小] [中]                  │
│   ┌────┬───────┬──────┬────────┬──────────┐                         │
│   │    │ 標誌  │ 演講 │ AI工程 │ 提交     │                         │  PATHWAY
│   ├────┼───────┼──────┼────────┼──────────┤                         │
│   │K   │  ✓    │  —   │   —    │ 1個/校   │                         │
│   │P初 │  ✓    │  ✓   │   —    │ 海報+原型│                         │
│   │P高 │  ✓    │  —   │   ✓    │ 海報+原型│                         │
│   │J初 │  ✓    │  —   │   ✓    │ 海報+原型│                         │
│   │J高 │  ✓    │  —   │   ✓    │ 海報+原型│                         │
│   └────┴───────┴──────┴────────┴──────────┘                         │
├──────────────────────────────────────────────────────────────────────┤
│   評審準則 — 60% 聚焦創新、工程與 AI                                  │
│       ╭─────╮       評審項目       比例                              │
│      ╱ 100% ╲      創新程度       30%                                │  JUDGING
│     │  30%   │     工程設計       10%                                │
│     │  10%   │     AI 應用        20%                                │
│     │  20%   │     問題定義       15%   ── 各組別分開評審 ──          │
│      ╲      ╱      科研分析       15%                                │
│       ╰─────╯      原型展示        5%                                │
│                    簡報及答辯       5%                                │
│   任務指揮團 (匿名) : 國家航天專家 · 學術權威 · 教育產業界 · 國家總指揮│
├──────────────────────────────────────────────────────────────────────┤
│   2026–2027 賽事日程                                                  │
│   [09/16]─[11/16]─[01/11]─[01/22]─[03/31]─[04/30]─[05/15]           │  TIMELINE
│       ✅      ✅     🔵     ⚪     ⚪      ⚪      🏁                  │
│   ┌─ 2026/09/16–10/31  招募 + 教師培訓 ───────────────────[.ics] ─┐ │
│   ├─ 2026/11/16          抽籤分組結果公佈 ─────────────────[.ics]─┤ │
│   ├─ 2027/01/11          賽事啟動禮 ───────────────────────[.ics]─┤ │
│   ├─ 2027/01/12–22       領取硬件套材 ─────────────────────[.ics]─┤ │
│   ├─ 2027/01–03          創新研發期 (講座/工作坊) ─────────[.ics]─┤ │
│   ├─ 2027/03/31          作品截止遞交 (海報A0 + 原型影片) ─[.ics]─┤ │
│   ├─ 2027/04/30          半決賽 ──────────────────────────[.ics]─┤ │
│   └─ 2027/05/中          總決賽暨創新作品展 ──────────────[.ics]─┘ │
├──────────────────────────────────────────────────────────────────────┤
│   獎項與成果                                                          │
│  ┌─────────────────┐ ┌─────────────────┐                             │
│  │HKATA 課程獎學金 │ │展覽 + 獎盃證書 │                             │  AWARDS
│  │持續進修航天及AI│ │公開展出青年成果│                             │
│  └─────────────────┘ └─────────────────┘                             │
│   每組別設冠、亞、季軍 ─ 讓青年創科概念走出課堂                       │
├──────────────────────────────────────────────────────────────────────┤
│   N.O.R.A. Kids 星際 AI 學院 App          [App Store][Google Play]   │  ECOSYSTEM
│   中國航天科普 · 航天發展歷程 · 航天英雄故事 · 香港科研貢獻            │
├──────────────────────────────────────────────────────────────────────┤
│   主辦: 教育局 · 心繫家國 · SPSC · HKSSSC · HKATA                     │  ORGANIZERS
│   策略夥伴: [logo] [logo] [logo] [logo]                                │
├──────────────────────────────────────────────────────────────────────┤
│ © 2026 HKATA  ·  聯絡秘書處  ·  學校報名                              │  FOOTER
└──────────────────────────────────────────────────────────────────────┘
```

### 7.2 Mobile ≤ 640px

```
┌─────────────────────────┐
│ [HKATA]            ☰   │  HEADER (compact)
├─────────────────────────┤
│ [心繫家國]              │
│ 築夢太空創未來           │  HERO (stacked)
│ 探索宇宙新想像           │
│ ⏰ 24 天                │
│ [我是:家長/老師/學生]   │
│ ┌─────────────────────┐ │
│ │ 🖌️ 幼稚園組        │ │
│ │ 標誌設計 + 填色     │ │
│ │ [立即報名]          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🚀 小學組           │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🛰️ 中學組           │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│   >300 學校             │  AT-A-GLANCE
│   >1,000 隊伍           │
│   >20,000 學生          │
├─────────────────────────┤
│   三大賽事組別           │  TRACKS
│   [Track 01 卡]          │
│   [Track 02 卡]          │
│   [Track 03 卡]          │
├─────────────────────────┤
│   我適合甚麼比賽?        │  PATHWAY
│   (展開式卡片)           │
├─────────────────────────┤
│   評審準則 donut         │  JUDGING
│   任務指揮團 (匿名)      │
├─────────────────────────┤
│   賽事日程 [時間軸]      │  TIMELINE
│   1. 09/16 招募 ✅       │
│   2. 11/16 抽籤 ✅       │
│   3. 01/11 啟動 🔵       │
│   ...                    │
├─────────────────────────┤
│   獎項 (垂直卡片)        │  AWARDS
├─────────────────────────┤
│   App (純學習, 無投票)   │  ECOSYSTEM
├─────────────────────────┤
│   [學校報名]             │  STICKY BOTTOM BAR
└─────────────────────────┘
```

### 7.3 Tablet 641–1023px

- Hero cards collapse to a single horizontal scrollable row (snap-x).
- Pathway matrix shown as a horizontal scroll table with the first column sticky.
- Timeline keeps 2-column grid (same as desktop), but with reduced font size.
- Awards tiles: 2-col grid (2 tiles).

---

## 8. Reusable Component Inventory

| Component | Used in | Notes |
|---|---|---|
| `<GroupCard>` | Hero, Tracks | props: `group` (K/P/S), `accent`, `icon`, `title`, `subtitle`, `cta`, `href` |
| `<StatTile>` | At-a-glance | props: `number`, `unit`, `caption` |
| `<TrackCard>` | Tracks directory | props: `trackId`, `title`, `audience`, `description`, `href` |
| `<MatrixRow>` | Pathway | props: `group`, `flags[]`, `submission` |
| `<RubricDonut>` | Judging | props: `criteria[]` with weight |
| `<AnonPanel>` | Judging | props: `expertise`, `description` |
| `<TimelinePill>` | Timeline | props: `date`, `status`, `title`, `desc`, `icsHref` |
| `<AwardTile>` | Awards | props: `icon`, `title`, `desc` |
| `<AnchorNav>` | Header | props: `sections[]` |
| `<StickyBar>` | Mobile body | always-on 學校報名 |
| `<CountdownTimer>` | Hero | props: `targetDate` (2026/10/31) |
| `<AudienceSwitcher>` | Hero | props: `value`, `onChange` |
| `<OrgLogo>` | Organizers | props: `src`, `name`, `tier` |

Tailwind: keep utility-first, but factor these into HTML partials if the build supports it. Otherwise duplicate cleanly in `index.html` so it can be copied to other pages later.

---

## 9. Final Copy Deck (Traditional Chinese, ready to drop in)

### Hero
- Eyebrow: 香港回歸30周年 · 教育局「心繫家國」聯校活動
- H1: 築夢太空創未來  ·  探索宇宙新想像
- Sub: 結合航天工程、人工智能與創新思維。2026–2027 年度全港中小學及幼稚園航天 AI 創新盛事。
- Countdown label: 距離學校報名截止
- Switcher: 我是 [家長] [老師] [學生]
- Primary: 下載比賽手冊 (PDF)

### Hero group cards
- **K card**
  - Title: 幼稚園組
  - Sub: 太空任務標誌設計 · 太空基地填色
  - Tag: 毋須編程 · 全校皆可參與
  - CTA: 查看組別詳情
- **P card**
  - Title: 小學組
  - Sub: 標誌設計 · 演講比賽 · AI 工程 (高小)
  - Tag: 小一至小六 · 多元任務
  - CTA: 查看組別詳情
- **S card**
  - Title: 中學組
  - Sub: AI 太空工程挑戰 (初中/高中)
  - Tag: 初/高中分流 · 配備官方硬件
  - CTA: 查看組別詳情

### At-a-glance
- Title: 比賽目標
- Tiles: >300 學校 · >1,000 隊伍 · >20,000 學生 · 慶祝特區成立30週年

### Tracks
- Title: 三大賽事組別
- Sub: 專為幼稚園至中學不同年齡層量身打造的航天挑戰。
- See §3.4 card list.

### Pathway
- Title: 我適合甚麼比賽?
- Sub: 揾到最適合你年級嘅賽道，3 秒一目了然。
- Filter pills: 全部 · 幼稚園 · 小學 · 中學
- Column headers: 標誌設計/填色 · 演講 · AI 工程 · 提交作品

### Judging
- Title: 評審準則
- Sub: 60% 評分聚焦創新、工程與 AI。
- Donut center: 100% 核心評分
- Closing line: 由國家航天英雄、學界泰斗與產業專家三層組成，確保評分公平並切合不同年齡學生的能力水平。

### Timeline
- Title: 2026–2027 賽事日程
- Sub: 重要日子一目了然，支援匯入行事曆。
- Pill labels: 已完成 · 進行中 · 即將開始 · 重點里程碑
- Per item, status badge + title + description + [.ics 下載]

### Awards
- Title: 獎項與成果
- Sub: 每個組別設冠、亞、季軍；得獎隊伍可獲獎學金及公開展出機會。

### Ecosystem
- Title: N.O.R.A. Kids — 星際 AI 學院 App
- Bullets: 中國航天科普知識 · 中國航天發展歷程 · 航天英雄故事 · 香港科研貢獻
- CTA: 立即下載 App · 家長/老師指南 (secondary)

### Organizers
- 教育局 · 心繫家國 · 香港津貼小學議會 · 香港津貼中學議會 · 香港航天科技教育學院

---

## 10. Micro-Interactions & Animations

| Element | Trigger | Effect |
|---|---|---|
| Hero group card | hover | scale 1.02, border accent lights up, arrow slides right 4px |
| Hero group card | audience switcher | selected card grows to 1.05 and front, others dim to 0.6 opacity |
| Hero CTA | click | subtle press-down 0.97 scale + 120 ms rebound |
| Stat tile | in viewport | count-up number animation (1.2s ease-out) |
| Track card | hover | gradient border sweep, slight elevation |
| Pathway row | filter toggle | row fades + collapses height (200 ms ease) |
| Rubric donut | in viewport | stroke-dashoffset animates from full circumference to % over 1.5s |
| Timeline pill | click | expands corresponding card with smooth height transition |
| Timeline [Add to Calendar] | click | downloads `.ics`, shows toast "已加入行事曆" |
| Award tile | hover | icon rotates 6° and emits a single particle burst |
| Starfield | scroll | parallax 0.4× scroll speed (already partial; tighten) |

---

## 11. Responsive Breakpoint Behavior

| Breakpoint | Hero | Tracks | Pathway | Timeline | Awards |
|---|---|---|---|---|---|
| < 640 px | stacked cards | vertical stack | collapsible card per group | vertical timeline, status badge inline | 1-col |
| 640–1023 px | horizontal scroll-snap cards | 2-col grid | horizontally-scrollable table, sticky first col | 2-col grid | 2×2 grid |
| ≥ 1024 px | 3 cards right of headline | 4-col grid | full table | 2-col grid | 4-col grid |

Container max widths: keep `max-w-[1200px]` hero/main, `max-w-[1400px]` header.

---

## 12. Accessibility Checklist

- All interactive elements reachable via keyboard; visible focus ring (cyan `#00F2FE`, 2 px).
- Color contrast ≥ 4.5:1 for body text, 3:1 for large text. Verify judge panel + rubric labels against `#060913`.
- ARIA: `<nav aria-label="主選單">`, `<main>` landmark, section landmarks per IA, `aria-current="page"` on active nav link.
- Form inputs (countdown, audience switcher) labelled via `aria-label`.
- Audience switcher: announce change via `aria-live="polite"`.
- Rubric donut: provide accessible `<table>` fallback with the same numbers for screen readers.
- Reduced-motion: disable starfield parallax and count-up when `prefers-reduced-motion: reduce`.
- All decorative SVG/Canvas marked `aria-hidden="true"`.

---

## 13. Performance Budget

- HTML size: ≤ 80 KB (current is ~46 KB, budget leaves headroom for new sections).
- CSS: keep Tailwind via CDN; final production build should purge unused classes.
- JS: only the existing starfield + small additions (countdown, audience switcher, .ics generator). Total ≤ 8 KB gzipped.
- Images: lazy-load anything below the fold; prefer SVG icons.
- LCP target: ≤ 2.0 s on 4G (Hero H1 must be the LCP element).

---

## 14. Content Priority / MVP Cut

If implementation must ship in two phases, ship in this order:

**Phase 1 (must-have, addresses all 6 brief items):**
1. New IA header + anchor nav
2. Hero with 3 group cards + countdown
3. At-a-glance 4 tiles
4. Tracks directory (high-level, no engineering detail)
5. Anonymized Judging section + rubric donut
6. Promoted Timeline with status pills

**Phase 2 (nice-to-have):**
1. Pathway matrix (helps SEO long-tail, but not in the brief)
2. Awards section (scholarship + exhibition tiles)
3. Audience switcher behaviour
4. Add-to-Calendar (.ics)
5. Sticky mobile CTA bar
6. Animation polish + reduced-motion fallback

---

## 15. Analytics Events (recommended)

| Event | Trigger | Property |
|---|---|---|
| `hero_group_card_click` | click on K/P/S card | `group`, `audience` |
| `audience_switched` | click switcher | `value` (家長/老師/學生) |
| `register_cta_click` | any 學校報名 CTA | `location` (header/hero/sticky/footer) |
| `track_outbound_click` | click into track0X.html | `track_id` |
| `timeline_ics_download` | click [.ics] | `milestone_id` |
| `manual_download` | click 下載比賽手冊 | — |
| `pathway_filter_used` | click filter pill | `value` |
| `app_store_click` | click App Store / Google Play | `store` |
| `scroll_depth` | 25/50/75/100 % | — |

---

## 16. Open Questions (refined)

1. **Audience switcher behavior** — should it actually reorder/resize cards, or just highlight one (less layout thrash on mobile)?
2. **Add-to-Calendar (.ics)** — generate per-event `.ics` files statically, or build them client-side from a JSON data file?
3. **Pathway matrix** — render as semantic `<table>` (best a11y) or as styled card grid (best mobile UX)?
4. **Awards imagery** — reuse existing space-themed backgrounds (no rocket-launch imagery since launch content is excluded) or rely on typography-only award tiles?
5. **Bilingual labels** — full English subtitles on every card (recommended for international press / overseas schools), or English only in a top-level language toggle?
6. **OG share image** — auto-generate from the new Hero via Canvas/SVG at build time, or design a static image once?

Defaults if unanswered: (1) highlight-only on the same card; (2) client-side JSON; (3) semantic `<table>` with card fallback on mobile; (4) typography-only award tiles with existing starfield; (5) English subtitle per card; (6) static designed image.
