"""
Cartographic Cosmos — hero banner for the HKATA "Aerospace Dream Building" AI Innovation Competition.

Design philosophy: institutional space, observatory aesthetic, mid-century celestial chart.
- Deep institutional navy canvas (with subtle aurora highlight)
- Precise concentric orbits (hairline azure)
- Single ceremonial gold horizon
- Sparse serif display + mono captions
- Bilateral ceremonial axis: anniversary mark → campaign name → registry horizon

Output: doc/img/hero-banner.png (1920x720) + doc/img/hero-banner-og.png (1200x630)
"""
from PIL import Image, ImageDraw, ImageFont
from math import sin, cos, pi, radians

# ---- Canvas ----------------------------------------------------------------
W, H = 1920, 720
img = Image.new('RGB', (W, H), '#0A1224')
d = ImageDraw.Draw(img, 'RGBA')

# ---- Tokens (mirrors assets/theme.css) -----------------------------------
AZURE    = (46, 111, 224)
AZURE_4  = (76, 141, 245)
AZURE_3  = (143, 182, 250)
AZURE_2  = (180, 210, 255)
GOLD     = (199, 162, 76)
GOLD_3   = (227, 201, 131)
GOLD_5   = (155, 124, 51)
TEXT_HI  = (234, 240, 250)
TEXT_BD  = (200, 210, 224)
TEXT_MT  = (140, 155, 180)
GREEN    = (36, 161, 72)

# ---- Fonts -----------------------------------------------------------------
FONT_DIR = '/Users/user/hkata-ai-com/HKATA_AI_COM/.kilo/skills/canvas-design/canvas-fonts'

def F(name, size):
    return ImageFont.truetype(f'{FONT_DIR}/{name}.ttf', size)

def CN(size):
    return ImageFont.truetype('/System/Library/Fonts/PingFang.ttc', size, index=0)

serif_bold = F('IBMPlexSerif-Bold', 86)
serif_med  = F('IBMPlexSerif-Regular', 32)
mono_xs    = F('JetBrainsMono-Regular', 13)
mono_sm    = F('JetBrainsMono-Regular', 14)
mono_md    = F('JetBrainsMono-Bold', 16)
big_num    = F('BigShoulders-Bold', 56)

# ---- Background: a luminous observatory field -----------------------------
# 1) Aurora / radial highlight: warm gold at lower-center (sun-rise feel)
for r in range(900, 0, -6):
    t = r / 900
    # gold warm at center, fading out
    a = int(70 * (1 - t) ** 2)
    d.ellipse([W*0.55-r, H*0.55-r, W*0.55+r, H*0.55+r], fill=(*GOLD_5, a))
del r

# 2) A second cool highlight at top-left (sky tone)
for r in range(700, 0, -6):
    t = r / 700
    a = int(50 * (1 - t) ** 2)
    d.ellipse([W*0.20-r, H*0.20-r, W*0.20+r, H*0.20+r], fill=(*AZURE, a))
del r

# 3) Faint star-field (random small dots) — sparse, deliberate
import random
random.seed(42)
for _ in range(120):
    x = random.randint(0, W)
    y = random.randint(0, H)
    s = random.choice([1, 1, 1, 2])
    a = random.randint(40, 120)
    d.ellipse([x-s, y-s, x+s, y+s], fill=(255, 255, 255, a))

# 4) Hairline grid (every 60px) — visible, atlas-like
for x in range(0, W, 60):
    d.line([(x, 0), (x, H)], fill=(255, 255, 255, 20), width=1)
for y in range(0, H, 60):
    d.line([(0, y), (W, y)], fill=(255, 255, 255, 20), width=1)

# 5) Heavier grid lines (every 240px)
for x in range(0, W, 240):
    d.line([(x, 0), (x, H)], fill=(255, 255, 255, 50), width=1)
for y in range(0, H, 240):
    d.line([(0, y), (W, y)], fill=(255, 255, 255, 50), width=1)

# ---- Concentric orbits (the cosmos, right side) ---------------------------
CX, CY = W * 0.78, H * 0.50

orbit_radii = [80, 140, 210, 290, 370, 450, 530, 600]
for i, r in enumerate(orbit_radii):
    a = max(40, 160 - i * 16)
    d.ellipse([CX-r, CY-r, CX+r, CY+r], outline=(*AZURE_3, a), width=1)

# Satellite markers on the orbits (small white dots with a thin halo)
sat_positions = [
    (80, 35), (140, 215), (210, 142), (290, 25),
    (370, 290), (450, 170), (530, 60), (600, 240),
]
for r, deg in sat_positions:
    rad = radians(deg)
    x = CX + r * cos(rad)
    y = CY + r * sin(rad)
    # outer halo
    d.ellipse([x-5, y-5, x+5, y+5], fill=(*AZURE_2, 80))
    # inner dot
    d.ellipse([x-2, y-2, x+2, y+2], fill=TEXT_HI)

# A single observation arc — 60° sweep, on the largest radius
arc_r = 660
bbox = [CX-arc_r, CY-arc_r, CX+arc_r, CY+arc_r]
d.arc(bbox, start=200, end=320, fill=(*AZURE_4, 220), width=2)

# Tiny tick marks on the outer arc (like a protractor)
for ang in range(200, 321, 8):
    rad = radians(ang)
    x1 = CX + (arc_r-4) * cos(rad)
    y1 = CY + (arc_r-4) * sin(rad)
    x2 = CX + arc_r * cos(rad)
    y2 = CY + arc_r * sin(rad)
    d.line([(x1, y1), (x2, y2)], fill=(*AZURE_3, 160), width=1)

# ---- The campaign name (left-aligned, ceremonial axis) -------------------
LEFT_X = 120

# Top: institutional endorsement (mono, small caps)
y = 100
d.text((LEFT_X, y), 'HKSAR · EDUCATION BUREAU', fill=GOLD_3, font=mono_md)
d.text((LEFT_X, y+28), '30TH ANNIVERSARY · 「PATRIOTIC HEARTS, CHINESE FAMILY」CAMPAIGN', fill=TEXT_BD, font=mono_sm)

# A small gold rule under the endorsement
d.line([(LEFT_X, y+72), (LEFT_X+80, y+72)], fill=GOLD, width=3)

# Year — large Big Shoulders, ceremonial
y2 = 200
d.text((LEFT_X, y2), '2026 — 2027', fill=GOLD_3, font=big_num)
# tiny coordinate label next to year
d.text((LEFT_X+340, y2+24), '/  JURISDICTION  ·  HONG KONG SAR', fill=TEXT_MT, font=mono_sm)

# The campaign name — three lines of Chinese
y3 = 290
# Line 1: full white
d.text((LEFT_X, y3),    '全港首屆中小學', fill=TEXT_HI, font=CN(64))
# Line 2: blue (the campaign title)
d.text((LEFT_X, y3+80), '「航天築夢」', fill=AZURE_3, font=CN(80))
# Line 3: gold (the "AI innovation" framing)
d.text((LEFT_X, y3+80+100), '航天 AI 創新大賽', fill=GOLD_3, font=CN(64))

# Subtle hairline rule under the campaign name
d.line([(LEFT_X, y3+260), (LEFT_X+640, y3+260)], fill=(255, 255, 255, 60), width=1)

# ---- Below the campaign name: co-organizers ------------------------------
y4 = y3 + 280
d.text((LEFT_X, y4),    'CO-ORGANIZERS', fill=TEXT_MT, font=mono_md)
# Chinese co-organizer names — use the Chinese font
d.text((LEFT_X+200, y4),'教育局  ·  心繫家國  ·  SPSC  ·  HKSSSC  ·  HKATA', fill=TEXT_BD, font=CN(20))

# ---- Bottom strip: campaign coordinates ---------------------------------
y5 = H - 60
d.text((LEFT_X, y5),   'ORBIT  /  R.A. 22h 04m  ·  DEC. −12° 21′  ·  MAG. 6.5  ·  EPOCH 2026.8', fill=TEXT_BD, font=mono_xs)
d.text((LEFT_X, y5+22), 'NEXT CONJUNCTION  /  2026·10·31  23:59  HKT  /  REGISTRATION CLOSES', fill=TEXT_BD, font=mono_xs)

# ---- Right side: observatory registration seal --------------------------
SEAL_X, SEAL_Y, SEAL_S = W - 320, 110, 180
# outer square (1px gold)
d.rectangle([SEAL_X, SEAL_Y, SEAL_X+SEAL_S, SEAL_Y+SEAL_S], outline=GOLD, width=2)
# inner square (subtle, hairline)
d.rectangle([SEAL_X+10, SEAL_Y+10, SEAL_X+SEAL_S-10, SEAL_Y+SEAL_S-10], outline=(255,255,255,60), width=1)

# Inside the seal: crosshair (telescope reticle)
mid = (SEAL_X + SEAL_S/2, SEAL_Y + SEAL_S/2)
d.line([(mid[0]-30, mid[1]), (mid[0]+30, mid[1])], fill=GOLD, width=1)
d.line([(mid[0], mid[1]-30), (mid[0], mid[1]+30)], fill=GOLD, width=1)
# inner ring
d.ellipse([mid[0]-16, mid[1]-16, mid[0]+16, mid[1]+16], outline=GOLD, width=1)
# "30" centered
tw = d.textlength('30', font=F('BigShoulders-Bold', 28))
th = 28
d.text((mid[0]-tw/2, mid[1]-th/2-2), '30', fill=GOLD_3, font=F('BigShoulders-Bold', 28))

# Seal labels
d.text((SEAL_X+14, SEAL_Y+14), 'HKATA', fill=GOLD_3, font=mono_md)
d.text((SEAL_X+14, SEAL_Y+14+22), 'REG. 2026·01', fill=TEXT_MT, font=mono_xs)
d.text((SEAL_X+14, SEAL_Y+SEAL_S-36), 'STATUS', fill=TEXT_MT, font=mono_xs)
d.text((SEAL_X+14, SEAL_Y+SEAL_S-16), 'OPEN', fill=GREEN, font=mono_md)

# ---- Bottom-right corner: chart number ----------------------------------
chart_no = 'PLATE  I  ·  CARTOGRAPHIC  COSMOS  ·  HKATA  2026'
tw = d.textlength(chart_no, font=mono_xs)
d.text((W - tw - 40, H - 30), chart_no, fill=TEXT_MT, font=mono_xs)

# ---- Save ----------------------------------------------------------------
out = '/Users/user/hkata-ai-com/HKATA_AI_COM/doc/img/hero-banner.png'
img.save(out, 'PNG', optimize=True)
print(f'Saved {out}  {W}x{H}')

og = img.resize((1200, 630), Image.LANCZOS)
og.save('/Users/user/hkata-ai-com/HKATA_AI_COM/doc/img/hero-banner-og.png', 'PNG', optimize=True)
print('Saved doc/img/hero-banner-og.png  1200x630')
