"""Verify every fact's quote exists in its downloaded source text, then render content/sources.md.

Exit code 1 if any quote is missing. Source texts live in content/raw/ (see fetch_sources.py).
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
SECTIONS = {"bio": "1. Биография компании", "first": "2. Первые LEGO", "now": "3. Компания сейчас", "modern": "4. Современные работы"}


def norm(s: str) -> str:
    s = s.translate(str.maketrans({"“": '"', "”": '"', "‘": "'", "’": "'", "–": "-", "—": "-", " ": " "}))
    return re.sub(r"\s+", " ", s).strip().lower()


def main() -> int:
    data = json.loads((CONTENT / "facts.json").read_text(encoding="utf-8"))
    sources, facts = data["sources"], data["facts"]
    texts = {k: norm((CONTENT / "raw" / s["raw"]).read_text(encoding="utf-8")) for k, s in sources.items()}
    missing = [f for f in facts if norm(f["quote"]) not in texts[f["source"]]]
    for f in missing:
        print(f"MISSING  {f['id']:20} [{f['source']}] {f['quote'][:80]}")
    print(f"{len(facts) - len(missing)}/{len(facts)} facts verified")

    used = list(dict.fromkeys(f["source"] for f in facts))
    num = {k: i + 1 for i, k in enumerate(used)}
    out = ["# Источники", "", "Сгенерировано `scripts/check_facts.py`: у каждого факта есть дословная цитата, "
           "найденная в тексте источника (`content/raw/`).", ""]
    for sec, title in SECTIONS.items():
        out += [f"## {title}", "", "| Факт | Источник | Цитата |", "|---|---|---|"]
        out += [f"| {f['ru']} | [{num[f['source']]}] | “{f['quote']}” |" for f in facts if f["section"] == sec]
        out.append("")
    out += ["## Список источников", ""]
    out += [f"{num[k]}. {sources[k]['publisher']}: [{sources[k]['title']}]({sources[k]['url']})" for k in used]
    images = json.loads((CONTENT / "images.json").read_text(encoding="utf-8"))
    out += ["", "## Изображения (Wikimedia Commons)", "", "| Файл | Автор | Лицензия |", "|---|---|---|"]
    out += [f"| [{v['title'].removeprefix('File:')}]({v['page']}) | {v['author']} | {v['license']} |" for v in images.values()]
    out += ["", "Фотографии скульптур Натана Саваи — снимки посетителей выставки; права на сами скульптуры принадлежат автору.", ""]
    (CONTENT / "sources.md").write_text("\n".join(out), encoding="utf-8")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
