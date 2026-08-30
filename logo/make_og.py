from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1200, 630
BG = (251, 250, 253)  # matches --background
FG = (24, 24, 27)     # zinc-900
MUTED = (82, 82, 91)  # zinc-600
TOP = (142, 45, 226)
BOTTOM = (197, 21, 107)

img = Image.new('RGB', (W, H), BG)

# soft radial glow (purple tint with alpha)
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
glow_px = glow.load()
cx, cy = W // 2, H // 2
max_r = 420
for y in range(H):
    for x in range(W):
        d = math.hypot(x - cx, y - cy)
        if d < max_r:
            a = int(20 * (1 - d / max_r))
            glow_px[x, y] = (TOP[0], TOP[1], TOP[2], a)
img.paste(glow, (0, 0), glow)

# gradient line accent at bottom
d = ImageDraw.Draw(img)
for x in range(W):
    t = x / (W - 1)
    r = int(TOP[0] + (BOTTOM[0] - TOP[0]) * t)
    g = int(TOP[1] + (BOTTOM[1] - TOP[1]) * t)
    b = int(TOP[2] + (BOTTOM[2] - TOP[2]) * t)
    d.line([(x, H-6), (x, H)], fill=(r, g, b))

# load updated logo
logo = Image.open('public/infinite-slop-logo.png').convert('RGBA')
logo_size = 260
logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
img.paste(logo, (130, (H - logo_size)//2), logo)

# text
try:
    font_title = ImageFont.truetype('C:/Windows/Fonts/Inter-Bold.ttf', 72)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/Inter-Regular.ttf', 34)
    font_url = ImageFont.truetype('C:/Windows/Fonts/Inter-Regular.ttf', 28)
except Exception:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_url = ImageFont.load_default()

x_text = 460
y_title = 220
d.text((x_text, y_title), 'Infinite Slop', fill=FG, font=font_title)
d.text((x_text, y_title + 95), 'Infinite Interactive AI Generated Live Stream', fill=MUTED, font=font_sub)
d.text((x_text, H - 90), 'www.infinite-slop.com', fill=BOTTOM, font=font_url)

img.save('public/og-image.png', 'PNG')
print('OG image saved public/og-image.png')
