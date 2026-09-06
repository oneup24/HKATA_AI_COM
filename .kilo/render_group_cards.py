"""
Cartographic Cosmos — 3 group card BANNER images (top-of-card hero art).
Each 800x300 PNG, rounded 16px, deep navy with the group's accent.
Designed to fill the top of each group card (wide aspect, more visual real estate).
"""
from PIL import Image, ImageDraw, ImageFont
from math import sin, cos, pi, radians

FONT_DIR = '/Users/user/hkata-ai-com/HKATA_AI_COM/.kilo/skills/canvas-design/canvas-fonts'
def F(name, size):
    return ImageFont.truetype(f'{FONT_DIR}/{name}.ttf', size)

NAVY_900 = '#0A1224'
NAVY_800 = '#0F1A30'

K = (63, 166, 160)
P = (59, 123, 209)
S = (107, 99, 196)
GOLD = (199, 162, 76)
GOLD_3 = (227, 201, 131)
TEXT_HI = (234, 240, 250)
TEXT_MT = (140, 155, 180)
TEXT_BD = (200, 210, 224)

W, H = 800, 300

def base_canvas():
    img = Image.new('RGB', (W, H), NAVY_900)
    d = ImageDraw.Draw(img, 'RGBA')
    # subtle horizontal aurora band
    for r in range(420, 0, -4):
        a = int(38 * (1 - r/420))
        d.ellipse([W*0.35-r, H*0.55-r, W*0.35+r, H*0.55+r], fill=(15, 26, 48, a))
    # star field
    import random
    random.seed(11)
    for _ in range(60):
        x = random.randint(0, W)
        y = random.randint(0, H)
        s = random.choice([1, 1, 1, 2])
        a = random.randint(50, 130)
        d.ellipse([x-s, y-s, x+s, y+s], fill=(255, 255, 255, a))
    # hairline grid every 40px
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 18), width=1)
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 18), width=1)
    return img, d

def apply_rounded_corners(img, radius=16):
    mask = Image.new('L', img.size, 0)
    m = ImageDraw.Draw(mask)
    m.rounded_rectangle([0, 0, img.size[0], img.size[1]], radius=radius, fill=255)
    out = Image.new('RGBA', img.size, (0, 0, 0, 0))
    out.paste(img, mask=mask)
    return out

def stamp_label(d, code, label, accent):
    """Registry code bottom-left, label bottom-right, plus a 1px hairline at the bottom."""
    d.text((24, H-30), code, fill=TEXT_MT, font=F('JetBrainsMono-Bold', 12))
    # measure label width
    tw = d.textlength(label, font=F('JetBrainsMono-Bold', 12))
    d.text((W-24-tw, H-30), label, fill=(*accent, 230), font=F('JetBrainsMono-Bold', 12))
    # bottom hairline (separates banner from card body)
    d.line([(24, H-50), (W-24, H-50)], fill=(*accent, 60), width=1)
    # small gold tick mark on the hairline
    d.line([(40, H-54), (40, H-46)], fill=(*accent, 220), width=2)

def make_kindergarten():
    img, d = base_canvas()
    cx, cy = W*0.30, H*0.50

    # teal aurora
    for r in range(220, 0, -4):
        a = int(70 * (1 - r/220))
        d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(*K, a))
    del r

    # 4 concentric orbits centered on the left third
    for i, r in enumerate([40, 75, 115, 160]):
        d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(*K, 220 - i*30), width=1)

    # 4 satellite markers on the orbits
    for r, deg in [(40, 35), (75, 215), (115, 142), (160, 25)]:
        rad = radians(deg)
        x = cx + r * cos(rad)
        y = cy + r * sin(rad)
        d.ellipse([x-4, y-4, x+4, y+4], fill=TEXT_HI)
        d.ellipse([x-2, y-2, x+2, y+2], fill=K)

    # 3 colored "palette" dots on the right side
    for i, c in enumerate([(80, 200, 180), GOLD, (220, 120, 120)]):
        y = 95 + i * 50
        d.ellipse([W-130-i*15-9, y-9, W-130-i*15+9, y+9], fill=(*c, 240))
        # small dot trail
        d.ellipse([W-130-i*15-4, y-4, W-130-i*15+4, y+4], fill=(*c, 100))

    # a small label INSIDE the orbit field
    d.text((cx-30, cy+175), '幼兒', fill=TEXT_HI, font=F('IBMPlexSerif-Bold', 28))

    stamp_label(d, 'K·01', 'KINDERGARTEN', K)
    return apply_rounded_corners(img, 16)

def make_primary():
    img, d = base_canvas()
    cx, cy = W*0.32, H*0.50

    # cool azure aurora from upper-left
    for r in range(280, 0, -4):
        a = int(50 * (1 - r/280))
        d.ellipse([100-r, 80-r, 100+r, 80+r], fill=(*P, a))
    del r

    # 5 concentric orbits centered
    for i, r in enumerate([30, 60, 95, 135, 180]):
        d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(*P, 230 - i*35), width=1)

    # A 100° arc — rocket trajectory from lower-left to upper-right
    arc_r = 200
    bbox = [cx-arc_r, cy-arc_r, cx+arc_r, cy+arc_r]
    d.arc(bbox, start=130, end=230, fill=(*P, 230), width=2)
    # tick marks on the arc
    for ang in range(130, 231, 8):
        rad = radians(ang)
        x1 = cx + 195 * cos(rad); y1 = cy + 195 * sin(rad)
        x2 = cx + 205 * cos(rad); y2 = cy + 205 * sin(rad)
        d.line([(x1, y1), (x2, y2)], fill=(*P, 200), width=1)

    # The rocket "moment" — a small white circle with a gold core (at the arc's end)
    rad = radians(220)
    rx = cx + 175 * cos(rad)
    ry = cy + 175 * sin(rad)
    d.ellipse([rx-10, ry-10, rx+10, ry+10], fill=(*P, 200))
    d.ellipse([rx-6, ry-6, rx+6, ry+6], fill=GOLD)
    d.ellipse([rx-3, ry-3, rx+3, ry+3], fill=TEXT_HI)

    # A second small satellite
    rad2 = radians(40)
    sx = cx + 100 * cos(rad2)
    sy = cy + 100 * sin(rad2)
    d.ellipse([sx-4, sy-4, sx+4, sy+4], fill=TEXT_HI)
    d.ellipse([sx-2, sy-2, sx+2, sy+2], fill=P)

    # small label
    d.text((cx-30, cy+205), '小學', fill=TEXT_HI, font=F('IBMPlexSerif-Bold', 28))

    stamp_label(d, 'P·02', 'PRIMARY', P)
    return apply_rounded_corners(img, 16)

def make_secondary():
    img, d = base_canvas()
    cx, cy = W*0.40, H*0.50

    # indigo aurora
    for r in range(280, 0, -4):
        a = int(55 * (1 - r/280))
        d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(*S, a))
    del r

    # 5 concentric orbits
    for i, r in enumerate([30, 65, 100, 145, 200]):
        d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(*S, 230 - i*35), width=1)

    # Central crosshair / AI node
    d.line([(cx-30, cy), (cx+30, cy)], fill=(*S, 220), width=1)
    d.line([(cx, cy-30), (cx, cy+30)], fill=(*S, 220), width=1)
    d.ellipse([cx-16, cy-16, cx+16, cy+16], outline=(*S, 230), width=1)
    d.ellipse([cx-5, cy-5, cx+5, cy+5], fill=GOLD)
    d.ellipse([cx-2, cy-2, cx+2, cy+2], fill=TEXT_HI)

    # Satellite 1 (top-right area) — square panel
    rad = radians(45)
    s1x = cx + 200 * cos(rad)
    s1y = cy + 200 * sin(rad)
    d.rectangle([s1x-10, s1y-10, s1x+10, s1y+10], outline=(*S, 240), width=1)
    d.line([(s1x-16, s1y), (s1x+16, s1y)], fill=(*S, 220), width=1)
    d.line([(s1x, s1y-16), (s1x, s1y+16)], fill=(*S, 220), width=1)
    d.ellipse([s1x-3, s1y-3, s1x+3, s1y+3], fill=GOLD_3)
    d.line([(cx, cy), (s1x, s1y)], fill=(*S, 80), width=1)

    # Satellite 2 (lower-left) — round
    rad2 = radians(210)
    s2x = cx + 145 * cos(rad2)
    s2y = cy + 145 * sin(rad2)
    d.ellipse([s2x-6, s2y-6, s2x+6, s2y+6], fill=(*S, 220))
    d.ellipse([s2x-3, s2y-3, s2x+3, s2y+3], fill=TEXT_HI)
    d.line([(cx, cy), (s2x, s2y)], fill=(*S, 80), width=1)

    # Small label
    d.text((cx-30, cy+220), '中學', fill=TEXT_HI, font=F('IBMPlexSerif-Bold', 28))

    stamp_label(d, 'S·03', 'SECONDARY', S)
    return apply_rounded_corners(img, 16)

# ---- Render ----
out_dir = '/Users/user/hkata-ai-com/HKATA_AI_COM/doc/img'

for name, fn in [('group-k.png', make_kindergarten),
                 ('group-p.png', make_primary),
                 ('group-s.png', make_secondary)]:
    img = fn()
    path = f'{out_dir}/{name}'
    img.save(path, 'PNG', optimize=True)
    print(f'Saved {path}  {img.size}')

# contact sheet
sheet = Image.new('RGB', (W, H*3 + 40*4), NAVY_900)
for i, name in enumerate(['group-k.png', 'group-p.png', 'group-s.png']):
    sheet.paste(Image.open(f'{out_dir}/{name}'), (0, 40 + i*(H+40)), Image.open(f'{out_dir}/{name}'))
sheet.save(f'{out_dir}/group-cards-preview.png', 'PNG', optimize=True)
print('Saved group-cards-preview.png')
