from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1200, 630
BG = (10, 10, 10)
TOP = (142, 45, 226)
BOTTOM = (197, 21, 107)
WHITE = (255, 255, 255)
GRAY = (161, 161, 170)

img = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img)

# soft radial glow
for r in range(400, 0, -1):
    t = r / 400
    a = int(20 * (1 - t))
    col = (TOP[0], TOP[1], TOP[2])
    d.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], outline=col)

# gradient line accent
for x in range(W):
    t = x / (W - 1)
    r = int(TOP[0] + (BOTTOM[0] - TOP[0]) * t)
    g = int(TOP[1] + (BOTTOM[1] - TOP[1]) * t)
    b = int(TOP[2] + (BOTTOM[2] - TOP[2]) * t)
    d.line([(x, H-6), (x, H)], fill=(r, g, b))

# load logo
logo = Image.open('public/infinite-slop-logo.png').convert('RGBA')
logo_size = 280
logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
img.paste(logo, (140, (H - logo_size)//2), logo)

# text
try:
    font_title = ImageFont.truetype('C:/Windows/Fonts/Inter-Bold.ttf', 72)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/Inter-Regular.ttf', 36)
    font_url = ImageFont.truetype('C:/Windows/Fonts/Inter-Regular.ttf', 28)
except Exception:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_url = ImageFont.load_default()

x_text = 480
y_title = 220
d.text((x_text, y_title), 'Infinite Slop', fill=WHITE, font=font_title)
d.text((x_text, y_title + 95), 'Infinite Interactive AI Generated Live Stream', fill=GRAY, font=font_sub)
d.text((x_text, H - 90), 'www.infinite-slop.com', fill=BOTTOM, font=font_url)

img.save('public/og-image.png', 'PNG')
print('OG image saved public/og-image.png')
