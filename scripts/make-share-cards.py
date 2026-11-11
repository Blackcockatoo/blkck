#!/usr/bin/env python3
"""Render the 1200x630 gold-on-black share cards in share/<key>.jpg (and share/<lang>/<key>.jpg).

Spec comes from `node scripts/share-spec.mjs` (worlds + home + store).
Fonts: Gelasio (Georgia-metric serif, matches the site's Georgia headings) and Inter;
Noto Serif/Sans CJK JP for Japanese, Noto Serif/Sans Devanagari for Hindi (needs Pillow with raqm).
Run: python3 scripts/make-share-cards.py
"""
import io, json, subprocess, zipfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "share"
W, H = 1200, 630
GOLD, GOLD_HOT, CREAM, MUTED = (199, 168, 106), (231, 199, 103), (232, 225, 208), (150, 144, 128)
FONT_DIRS = [Path("/usr/share/fonts"), Path.home() / ".fonts", ROOT / "scripts" / "fonts"]


def find_font(name):
    for d in FONT_DIRS:
        hits = sorted(d.rglob(name)) if d.exists() else []
        if hits:
            return str(hits[0])
    raise SystemExit(f"Font {name} not found — install Gelasio and Inter (Google Fonts) or drop the TTFs in scripts/fonts/")


SERIF = find_font("Gelasio-VariableFont_wght.ttf")
SERIF_I = find_font("Gelasio-Italic-VariableFont_wght.ttf")
SANS = find_font("Inter-VariableFont_opsz,wght.ttf")
FONTSETS = {"en": {"serif": (SERIF, 0), "serif_i": (SERIF_I, 0), "sans": (SANS, 0), "track": True}}
try:
    FONTSETS["ja"] = {"serif": (find_font("NotoSerifCJK-Regular.ttc"), 0), "serif_i": (find_font("NotoSerifCJK-Regular.ttc"), 0),
                      "sans": (find_font("NotoSansCJK-Bold.ttc"), 0), "track": True, "cjk": True}
    FONTSETS["hi"] = {"serif": (find_font("NotoSerifDevanagari-VariableFont_wdth,wght.ttf"), 0), "serif_i": (find_font("NotoSerifDevanagari-VariableFont_wdth,wght.ttf"), 0),
                      "sans": (find_font("NotoSansDevanagari-VariableFont_wdth,wght.ttf"), 0), "track": False}
except SystemExit as e:
    print(f"warning: {e} — localized cards skipped")


def font(path, size, weight=None):
    index = 0
    if isinstance(path, tuple):
        path, index = path
    f = ImageFont.truetype(path, size, index=index)
    if weight:
        try:
            axes = f.get_variation_axes()
            f.set_variation_by_axes([weight if a.get("name", b"") in (b"Weight", "Weight") else a["default"] for a in axes])
        except Exception:
            pass
    return f


def load_art(ref):
    if ref.startswith("zip:"):
        _, zpath, inner = ref.split(":", 2)
        with zipfile.ZipFile(ROOT / zpath) as z:
            return Image.open(io.BytesIO(z.read(inner))).convert("RGB")
    return ImageOps.exif_transpose(Image.open(ROOT / ref)).convert("RGB")


def tracked(draw, xy, text, fnt, fill, spacing):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + spacing
    return x


NO_START = set("、。，．！？）」』ー")


def wrap(draw, text, fnt, width, cjk=False):
    if cjk and not text.isascii():
        lines, cur = [], ""
        for ch in text:
            if draw.textlength(cur + ch, font=fnt) <= width or ch in NO_START or not cur:
                cur += ch
            else:
                lines.append(cur); cur = ch
        return lines + ([cur] if cur else [])
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= width:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def gold_text(card, xy, text, fnt):
    mask = Image.new("L", card.size, 0)
    ImageDraw.Draw(mask).text(xy, text, font=fnt, fill=255)
    grad = Image.new("RGB", (W, 1))
    stops = [(0, (138, 106, 50)), (0.32, (231, 199, 103)), (0.48, (255, 241, 168)), (0.66, (201, 161, 78)), (1, (125, 93, 42))]
    x0, x1 = xy[0], xy[0] + max(1, card.width // 2)
    for x in range(W):
        t = min(1, max(0, (x - x0) / (x1 - x0)))
        for (a, ca), (b, cb) in zip(stops, stops[1:]):
            if a <= t <= b:
                k = (t - a) / (b - a or 1)
                grad.putpixel((x, 0), tuple(round(ca[i] + (cb[i] - ca[i]) * k) for i in range(3)))
                break
    grad = grad.resize(card.size)
    # soft glow under the letters
    glow = mask.filter(ImageFilter.GaussianBlur(10)).point(lambda v: v * 0.35)
    card.paste(Image.new("RGB", card.size, (255, 150, 60)), (0, 0), glow)
    card.paste(grad, (0, 0), mask)


def render(spec):
    lang = spec.get("lang", "en")
    fs = FONTSETS.get(lang)
    if not fs:
        return False
    en = FONTSETS["en"]
    cjk = fs.get("cjk", False)
    latin = lambda text: lang == "en" or text.isascii()
    pick = lambda text, role: en[role] if latin(text) else fs[role]
    card = Image.new("RGB", (W, H), (7, 9, 12))
    # artwork panel on the right, fading into black
    art = load_art(spec["art"])
    pw = 700
    art = ImageOps.fit(art, (pw, H), Image.LANCZOS, centering=(0.5, 0.4))
    art = Image.blend(art, Image.new("RGB", art.size, (0, 0, 0)), 0.18)
    fade = Image.new("L", (pw, H))
    fd = ImageDraw.Draw(fade)
    for x in range(pw):
        fd.line([(x, 0), (x, H)], fill=int(255 * min(1, max(0, (x - 20) / 280)) ** 1.4))
    card.paste(art, (W - pw, 0), fade)
    # warm ember glow + vignette
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((-200, H - 180, 900, H + 260), fill=90)
    card.paste(Image.new("RGB", (W, H), (255, 110, 30)), (0, 0), glow.filter(ImageFilter.GaussianBlur(90)).point(lambda v: v * 0.5))
    d = ImageDraw.Draw(card)
    # frame + corner brackets
    d.rectangle((22, 22, W - 23, H - 23), outline=(199, 168, 106, 0), width=1)
    d.rectangle((22, 22, W - 23, H - 23), outline=(76, 64, 41))
    for (cx, cy, sx, sy) in ((22, 22, 1, 1), (W - 23, 22, -1, 1), (22, H - 23, 1, -1), (W - 23, H - 23, -1, -1)):
        d.line([(cx, cy), (cx + 46 * sx, cy)], fill=GOLD_HOT, width=2)
        d.line([(cx, cy), (cx, cy + 46 * sy)], fill=GOLD_HOT, width=2)
    # monogram
    d.ellipse((64, 62, 120, 118), outline=GOLD, width=2)
    mono = font(SANS, 15, 800)
    tw = d.textlength("B$S", font=mono)
    d.text((92 - tw / 2, 81), "B$S", font=mono, fill=GOLD_HOT)
    tracked(d, (138, 74), "BLUE $NAKE STUDIO", font(SANS, 15, 700), CREAM, 3.2)
    tracked(d, (138, 96), "FRANKSTON · NAARM · VICTORIA", font(SANS, 11, 600), MUTED, 2.4)
    # eyebrow
    if latin(spec["eyebrow"]) or fs["track"]:
        tracked(d, (72, 196), spec["eyebrow"].upper(), font(pick(spec["eyebrow"], "sans"), 16, 800), GOLD, 3.6 if latin(spec["eyebrow"]) else 2)
    else:
        d.text((72, 190), spec["eyebrow"], font=font(fs["sans"], 19, 700), fill=GOLD)
    # title (fit)
    size = 92
    while size > 44:
        tf = font(pick(spec["title"], "serif"), size, 500)
        lines = wrap(d, spec["title"], tf, 600, cjk and not latin(spec["title"]))
        if len(lines) <= 2 and all(d.textlength(l, font=tf) <= 600 for l in lines):
            break
        size -= 4
    y = 232
    for line in lines:
        gold_text(card, (68, y), line, tf)
        y += int(size * (1.02 if latin(spec["title"]) else 1.25))
    d = ImageDraw.Draw(card)
    # line
    lf = font(pick(spec["line"], "serif_i"), 30 if latin(spec["line"]) else 28, 400)
    y += 14
    for line in wrap(d, spec["line"], lf, 560, cjk and not latin(spec["line"]))[:2]:
        d.text((72, y), line, font=lf, fill=(217, 210, 194))
        y += 40 if latin(spec["line"]) else 46
    # footer
    x = tracked(d, (72, H - 92), "BLKCK2.COM", font(SANS, 16, 800), GOLD_HOT, 3)
    d.line([(x + 14, H - 83), (x + 70, H - 83)], fill=GOLD, width=1)
    out = OUT if lang == "en" else OUT / lang
    out.mkdir(parents=True, exist_ok=True)
    card.save(out / f"{spec['key']}.jpg", quality=86, optimize=True, progressive=True)
    return True


def main():
    spec = json.loads(subprocess.check_output(["node", str(ROOT / "scripts" / "share-spec.mjs")], cwd=ROOT))
    done = sum(1 for s in spec if render(s))
    print(f"{done} share cards → share/ (+ share/<lang>/)")


if __name__ == "__main__":
    main()
