"""
Cartographic Cosmos — Prospectus hero banner images.
3 banners, 1920x540 each, deep navy with level-specific theme.
Designed for readability: text always sits over dark navy, not over the
aurora glow. Auroras stay in the right 40% of the canvas.
"""
from PIL import Image, ImageDraw, ImageFont
from math import sin, cos, pi, radians

FONT_DIR = '/Users/user/hkata-ai-com/HKATA_AI_COM/.kilo/skills/canvas-design/canvas-fonts'
def F(name, size):
    return ImageFont.truetype(f'{FONT_DIR}/{name}.ttc'.replace('.ttc','.ttf').replace('.ttc','.ttf'), size)
def F(name, size):
    return ImageFont.truetype(f'{FONT_DIR}/{name}.ttf', size)
def CN(size):
    return ImageFont.truetype('/System/Library/Fonts/PingFang.ttc', size, index=0)

NAVY_900 = '#0A1224'
NAVY_800 = '#0F1A30'

# Group accent colors
K = (63, 166, 160)   # kindergarten - teal
P = (59, 123, 209)   # primary - azure
S = (107, 99, 196)   # secondary - indigo
GOLD = (199, 162, 76)
GOLD_3 = (227, 201, 131)
TEXT_HI = (234, 240, 250)
TEXT_BD = (200, 210, 224)
TEXT_MT = (140, 155, 180)

W, H = 1920, 540

def base_canvas(accent, accent_warm=None):
    """Navy canvas with VERY subtle aurora — readability first."""
    img = Image.new('RGB', (W, H), NAVY_900)
    d = ImageDraw.Draw(img, 'RGBA')

    # Very subtle right-side aurora (low alpha)
    for r in range(900, 0, -6):
        t = r / 900
        a = int(28 * (1 - t) ** 2)  # strong falloff
        d.ellipse([W*0.78-r, H*0.45-r, W*0.78+r, H*0.45+r], fill=(*accent, a))
    del r

    if accent_warm:
        # VERY subtle gold accent — only a faint warm hint
        for r in range(500, 0, -8):
            t = r / 500
            a = int(10 * (1 - t) ** 3)
            d.ellipse([W-100-r, H*0.3-r, W-100+r, H*0.3+r], fill=(*accent_warm, a))
        del r

    # Gradient: dark on left, subtle glow on right
    for x in range(0, W, 2):
        t = x / W
        a = int(100 * t)  # 0 → 100
        d.rectangle([x, 0, x+2, H], fill=(10, 18, 36, a))

    # Star field
    import random
    random.seed(42)
    for _ in range(160):
        x = random.randint(0, W)
        y = random.randint(0, H)
        s = random.choice([1, 1, 1, 2])
        a = random.randint(50, 140)
        d.ellipse([x-s, y-s, x+s, y+s], fill=(255, 255, 255, a))

    # Hairline grid
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 18), width=1)
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 18), width=1)

    return img, d

def add_atlas_orbits(d, cx, cy, color, num_orbits=7):
    """Concentric orbits with satellites — the cartographic cosmos signature."""
    for i, r in enumerate([40, 80, 130, 190, 260, 340, 430]):
        a = max(40, 180 - i * 20)
        d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(*color, a), width=1)
    for r, deg in [(40, 35), (80, 215), (130, 142), (190, 25), (260, 290), (340, 170), (430, 60)]:
        rad = radians(deg)
        x = cx + r * cos(rad)
        y = cy + r * sin(rad)
        d.ellipse([x-4, y-4, x+4, y+4], fill=TEXT_HI)
        d.ellipse([x-2, y-2, x+2, y+2], fill=color)
    arc_r = 510
    bbox = [cx-arc_r, cy-arc_r, cx+arc_r, cy+arc_r]
    d.arc(bbox, start=200, end=320, fill=(*color, 200), width=2)
    for ang in range(200, 321, 8):
        rad = radians(ang)
        x1 = cx + (arc_r-4) * cos(rad); y1 = cy + (arc_r-4) * sin(rad)
        x2 = cx + arc_r * cos(rad); y2 = cy + arc_r * sin(rad)
        d.line([(x1, y1), (x2, y2)], fill=(*color, 160), width=1)

def add_left_text(d, eyebrow, h1_text, subtitle, descriptor, accent):
    """Eyebrow + H1 + italic subtitle + descriptor — all on the left dark area."""
    # Eyebrow
    d.text((100, 110), eyebrow, fill=GOLD_3, font=F('JetBrainsMono-Bold', 18))
    # H1
    d.text((100, 150), h1_text, fill=TEXT_HI, font=CN(72))
    # Italic subtitle
    d.text((100, 245), subtitle, fill=accent, font=CN(38))
    # Descriptor (smaller, muted)
    d.text((100, 310), descriptor, fill=TEXT_MT, font=CN(20))

def add_gold_horizon_strip(d, color=GOLD):
    """Bottom hairline horizon for ceremonial anchor."""
    horizon_y = H - 30
    horizon_width = 1200
    x_start = (W - horizon_width) // 2
    x_end = x_start + horizon_width
    for x in range(x_start, x_end, 2):
        t = (x - x_start) / horizon_width
        a = int(180 * (1 - abs(2*t - 1)))
        d.line([(x, horizon_y), (x+2, horizon_y)], fill=(*color, a), width=2)
    # Ticks at intervals
    for tick_x in range(x_start + 50, x_end, 100):
        d.line([(tick_x, horizon_y-4), (tick_x, horizon_y+4)], fill=(*color, 100), width=1)

def add_registry_stamp(d, code, label, x=140, y=H-90):
    """Bottom-left registry stamp."""
    box_w, box_h = 220, 56
    d.rectangle([x, y, x+box_w, y+box_h], outline=GOLD, width=2)
    d.rectangle([x+6, y+6, x+box_w-6, y+box_h-6], outline=(255,255,255,60), width=1)
    d.text((x+12, y+8), 'HKATA', fill=GOLD_3, font=F('JetBrainsMono-Bold', 12))
    d.text((x+12, y+24), f'{code} · {label}', fill=TEXT_MT, font=F('JetBrainsMono-Regular', 10))
    d.text((x+12, y+38), 'STATUS · OPEN', fill=(36, 161, 72), font=F('JetBrainsMono-Bold', 10))

def make_kindergarten():
    img, d = base_canvas(K, GOLD_3)
    add_atlas_orbits(d, W*0.80, H*0.50, K)
    add_gold_horizon_strip(d)
    add_left_text(d,
        'KINDERGARTEN · 幼兒組',
        '幼兒比賽章程',
        '太空想像，從藝術起步。',
        '全港幼稚園 K1–K3 · 1 條賽道 · 毋須編程',
        K)
    add_registry_stamp(d, 'K·01', 'KINDERGARTEN')
    return img

def make_primary():
    img, d = base_canvas(P, GOLD_3)
    add_atlas_orbits(d, W*0.80, H*0.50, P)
    add_gold_horizon_strip(d)
    add_left_text(d,
        'PRIMARY · 小學組',
        '小學比賽章程',
        '未來月球基地築夢計劃。',
        '全港小學 P1–P6 · 3 條賽道',
        P)
    add_registry_stamp(d, 'P·02', 'PRIMARY')
    return img

def make_secondary():
    img, d = base_canvas(S, GOLD_3)
    add_atlas_orbits(d, W*0.80, H*0.50, S)
    add_gold_horizon_strip(d)
    add_left_text(d,
        'SECONDARY · 中學組',
        '中學比賽章程',
        '火星移民工程挑戰。',
        '全港中學 S1–S6 · 2 條賽道 · 7 款硬件套件',
        S)
    add_registry_stamp(d, 'S·03', 'SECONDARY')
    return img

# ---- Render ----
out_dir = '/Users/user/hkata-ai-com/HKATA_AI_COM/doc/img'

for name, fn in [('prospectus-banner-kindergarten.png', make_kindergarten),
                 ('prospectus-banner-primary.png',      make_primary),
                 ('prospectus-banner-secondary.png',    make_secondary)]:
    img = fn()
    path = f'{out_dir}/{name}'
    img.save(path, 'PNG', optimize=True)
    print(f'Saved {path}  {img.size}')
