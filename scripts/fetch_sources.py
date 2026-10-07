"""Download every source listed in content/facts.json into content/raw/ as plain text.

Wikipedia -> API plain-text extract; PDF -> pypdf text; other pages -> HTML stripped of tags.
Usage: python scripts/fetch_sources.py [source_key ...]
"""
import html, io, json, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "raw"
UA = {"User-Agent": "Mozilla/5.0 (lego-fan-site fact-check)"}


def get(url: str) -> bytes:
    for attempt in range(5):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 4:
                raise
            time.sleep(10 * (attempt + 1))  # rate limit
        except Exception as e:  # some news sites cut the stream; partial HTML is enough
            if getattr(e, "partial", None):
                return e.partial
            raise


def text_of(url: str) -> str:
    if "wikipedia.org/wiki/" in url:
        title = urllib.parse.unquote(url.rsplit("/", 1)[1])
        q = urllib.parse.urlencode({"action": "query", "prop": "extracts", "explaintext": 1, "titles": title,
                                    "format": "json", "redirects": 1})
        pages = json.loads(get(f"https://en.wikipedia.org/w/api.php?{q}"))["query"]["pages"]
        return next(iter(pages.values())).get("extract", "")
    data = get(url)
    if url.endswith(".pdf"):
        from pypdf import PdfReader
        return re.sub(r"\s+", " ", " ".join(p.extract_text() for p in PdfReader(io.BytesIO(data)).pages))
    t = re.sub(r"(?is)<(script|style).*?</\1>", " ", data.decode("utf-8", "ignore"))
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t)))


if __name__ == "__main__":
    sources = json.loads((ROOT / "content" / "facts.json").read_text(encoding="utf-8"))["sources"]
    OUT.mkdir(parents=True, exist_ok=True)
    for key in sys.argv[1:] or sources:
        text = text_of(sources[key]["url"])
        (OUT / sources[key]["raw"]).write_text(text, encoding="utf-8")
        print(f"{len(text):>7}  {key}")
        time.sleep(2)
