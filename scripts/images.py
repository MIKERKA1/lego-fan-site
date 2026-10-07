"""Download Wikimedia Commons images, convert to AVIF + WebP (2 widths), write attribution to content/images.json.

Usage: python scripts/images.py            # all images
       python scripts/images.py slug ...   # only some
"""
import html, io, json, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "img"
CREDITS = ROOT / "content" / "images.json"
WIDTHS = (800, 1600)
UA = {"User-Agent": "lego-fan-site/1.0 (educational fan project)"}

IMAGES = {
    "ole-kirk-1957": "File:Ole Kirk Christiansen, 1957.jpg",
    "patent-1958": "File:US3005282A Toy building brick (1958 filed, 1961 published) by Christiansen Godtfred Kirk - Lego brick, p.1, Fig. 1~6.png",
    "legoland-1968": "File:Legoland Miniland - Dybbøl Mølle 1968.jpg",
    "legoland-1977": "File:Legoland Billund, 1977 (02).jpg",
    "classic-space": "File:Lego Classic Space collection.jpg",
    "town-space": "File:Lego Town Set 588 and Lego Space Set 483 (8042568664).jpg",
    "technic-gears": "File:Lego technic gears.jpg",
    "playing-bricks": "File:Playing with Lego bricks.jpg",
    "lego-house": "File:LEGO house exterior 02.jpg",
    "sawaya-dinosaur": "File:Lego Dinosaur Skeleton - The Art of the Brick 2017.jpg",
    "sawaya-moai": "File:Moai Easter Island - Lego Statue by Nathan Sawaya.jpg",
    "ideas-treehouse": "File:Lego ideas 21318-treehouse building 05.jpg",
    "abb-bricks": "File:ABB bricks A.jpg",
    "bricks-1958": "File:Danmarks Tekniske Museum - Lego bricks.jpg",
    "town-system": "File:LEGO display, Deutsche Museum, München (8194869177).jpg",
    "duplo": "File:Lego & Lego Duplo by Christian Ursilva.jpg",
    "saturn-v": "File:Lego Saturn V rocket.jpg",
    "icons-moto": "File:Lego Harley-Davidson Motorcycle.jpg",
    "falcon": "File:Millennium falcon lego.jpg",
    "bonsai": "File:LEGO - zimowe drzewko bonsai.jpg",
    "art-mosaic": "File:The Gray Alien.jpg",
    "sagrada-store": "File:Tienda Lego de Barcelona - Sagrada Familia Lego.jpg",
}


def get(url: str) -> bytes:
    for attempt in range(5):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 4:
                raise
            time.sleep(10 * (attempt + 1))


def strip_tags(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def info(title: str) -> dict:
    q = urllib.parse.urlencode({"action": "query", "titles": title, "prop": "imageinfo", "format": "json",
                                "iiprop": "url|extmetadata|size", "iiurlwidth": max(WIDTHS)})
    page = next(iter(json.loads(get(f"https://commons.wikimedia.org/w/api.php?{q}"))["query"]["pages"].values()))
    ii = page["imageinfo"][0]
    m = ii["extmetadata"]
    return {
        "title": title,
        "page": ii["descriptionurl"],
        "download": ii.get("thumburl") or ii["url"],
        "author": strip_tags(m.get("Artist", {}).get("value", "unknown")),
        "license": m.get("LicenseShortName", {}).get("value", "unknown"),
        "licenseUrl": m.get("LicenseUrl", {}).get("value", ""),
    }


def convert(slug: str, data: bytes) -> dict:
    img = Image.open(io.BytesIO(data))
    img = img.convert("RGBA" if img.mode in ("RGBA", "LA", "P") else "RGB")
    if img.mode == "RGBA":  # patent drawings etc.: flatten onto white
        bg = Image.new("RGB", img.size, "white")
        bg.paste(img, mask=img.split()[3])
        img = bg
    for w in WIDTHS:
        im = img if img.width <= w else img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
        im.save(OUT / f"{slug}-{w}.avif", quality=55)
        im.save(OUT / f"{slug}-{w}.webp", quality=78, method=6)
    w = min(img.width, max(WIDTHS))
    return {"width": w, "height": round(img.height * w / img.width)}


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    credits = json.loads(CREDITS.read_text(encoding="utf-8")) if CREDITS.exists() else {}
    for slug in sys.argv[1:] or IMAGES:
        meta = info(IMAGES[slug])
        assert meta["license"] != "unknown", f"{slug}: no license, refusing"
        meta.update(convert(slug, get(meta["download"])))
        credits[slug] = meta
        print(f"{slug:18} {meta['license']:14} {meta['width']}x{meta['height']}  {meta['author'][:50]}")
        time.sleep(2)
    CREDITS.write_text(json.dumps(credits, ensure_ascii=False, indent=2), encoding="utf-8")
