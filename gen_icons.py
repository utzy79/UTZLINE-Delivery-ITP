#!/usr/bin/env python3
# Generates UTZLINE Delivery ITP's icon set: a simple delivery-truck
# silhouette (a cargo-box body + a cab, two wheels) in this app's own
# accent color -- amber/gold (#f0b23e, this app's dark-mode --accent), the
# one hue not already used by a sibling app: Site Measure/Viewer are
# orange-red (#c8391c / #ff6a3d), Install ITP is green (#1f8a4c),
# Manufacture ITP is purple (#7c3fd1), UTZLINE Projects is crimson
# (#ff3b3b), Scheduler is blue (#1f8fbf). Background/layout convention
# (near-black square, rounded for the "any"-purpose icons, full-bleed for
# maskable with the glyph kept inside the safe zone) copied from Install
# ITP's/Manufacture ITP's own icon set so all six apps' icons read as one
# family at a glance.
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(OUT, exist_ok=True)

BG = (18, 17, 16, 255)        # near-black, same as every sibling ITP-family icon
ACCENT = (240, 178, 62, 255)  # #f0b23e -- this app's own dark-mode --accent
ACCENT_DK = (122, 79, 5, 255) # #7a4f05 -- this app's own --accent-ink, used for wheel hubs/shading
WHITE = (250, 245, 235, 255)

def draw_truck(d, cx, cy, size, color, dark_color):
    # size = overall glyph width. Body rectangle (cargo box) on the left,
    # a smaller cab on the right, two wheel circles straddling the join --
    # a plain, immediately-readable "delivery truck" silhouette rather than
    # a detailed illustration.
    w = size
    h = size * 0.56
    ground_y = cy + h * 0.62

    body_w = w * 0.58
    body_h = h * 0.95
    body_x0 = cx - w * 0.5
    body_y0 = ground_y - body_h
    d.rounded_rectangle([body_x0, body_y0, body_x0 + body_w, ground_y], radius=size * 0.03, fill=color)

    cab_w = w * 0.36
    cab_h = h * 0.66
    cab_x0 = body_x0 + body_w - size * 0.02
    cab_y0 = ground_y - cab_h
    d.rounded_rectangle([cab_x0, cab_y0, cab_x0 + cab_w, ground_y], radius=size * 0.035, fill=color)

    # windscreen -- a small cut-out square in the cab, in the background
    # colour, so the cab reads as a cab rather than a second cargo box.
    win_margin = cab_w * 0.22
    win_x0 = cab_x0 + win_margin
    win_y0 = cab_y0 + cab_h * 0.16
    win_w = cab_w - win_margin * 1.7
    win_h = cab_h * 0.34
    d.rounded_rectangle([win_x0, win_y0, win_x0 + win_w, win_y0 + win_h], radius=size * 0.015, fill=BG)

    # two wheels straddling the body/cab join
    wheel_r = size * 0.11
    wheel_y = ground_y + wheel_r * 0.15
    for fx in (0.30, 0.72):
        wx = body_x0 + body_w * fx if fx < 0.6 else cab_x0 + cab_w * 0.42
        d.ellipse([wx - wheel_r, wheel_y - wheel_r, wx + wheel_r, wheel_y + wheel_r], fill=WHITE)
        hub_r = wheel_r * 0.42
        d.ellipse([wx - hub_r, wheel_y - hub_r, wx + hub_r, wheel_y + hub_r], fill=dark_color)

    # a couple of horizontal "cargo box" lines for a bit of texture
    line_w = max(2, int(size * 0.018))
    for fy in (0.38, 0.64):
        ly = body_y0 + body_h * fy
        d.line([body_x0 + size * 0.04, ly, body_x0 + body_w - size * 0.04, ly], fill=dark_color, width=line_w)

def make_icon(path, size, maskable):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if maskable:
        d.rectangle([0, 0, size, size], fill=BG)
        glyph_size = size * 0.60  # keep inside the safe zone
    else:
        d.rounded_rectangle([0, 0, size, size], radius=size * 0.18, fill=BG)
        glyph_size = size * 0.70
    draw_truck(d, size / 2, size / 2, glyph_size, ACCENT, ACCENT_DK)
    img.save(path)

make_icon(os.path.join(OUT, "icon-192.png"), 192, False)
make_icon(os.path.join(OUT, "icon-512.png"), 512, False)
make_icon(os.path.join(OUT, "icon-192-maskable.png"), 192, True)
make_icon(os.path.join(OUT, "icon-512-maskable.png"), 512, True)
print("done")
