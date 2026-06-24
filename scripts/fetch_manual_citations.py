#!/usr/bin/env python3
"""
manualcurated.txt のDOIをもとにウェブページをスクレイピングし、
static/citations/manualcurated_data.json を更新する。

使い方:
    python3 scripts/fetch_manual_citations.py
"""

import json
import re
import sys
import time
import urllib.request
import urllib.error
from html.parser import HTMLParser
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).parent.parent
TXT  = ROOT / "static/citations/manualcurated.txt"
JSON = ROOT / "static/citations/manualcurated_data.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; TogoTV-citation-bot/1.0)"
}


class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.metas: dict[str, list[str]] = {}

    def handle_starttag(self, tag, attrs):
        if tag != "meta":
            return
        d = dict(attrs)
        name = d.get("name") or d.get("property") or d.get("itemprop") or ""
        content = d.get("content", "").strip()
        if content:
            self.metas.setdefault(name, []).append(content)

    def get(self, *keys) -> str:
        for k in keys:
            vals = self.metas.get(k)
            if vals:
                return vals[0]
        return ""

    def get_all(self, *keys) -> list[str]:
        for k in keys:
            vals = self.metas.get(k)
            if vals:
                return vals
        return []


def fetch_html(url: str) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as r:
        charset = r.headers.get_content_charset() or "utf-8"
        return r.read().decode(charset, errors="replace")


def fetch_crossref_date(doi: str) -> str:
    """CrossRef API から publishedDate を取得する。戻り値例: '2026-06-15', '2026-06', '2026', ''"""
    url = f"https://api.crossref.org/works/{doi}"
    req = urllib.request.Request(url, headers={"User-Agent": "TogoTV-citation-bot/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode("utf-8"))
        msg = data.get("message", {})
        for key in ("published", "published-print", "published-online"):
            parts = (msg.get(key) or {}).get("date-parts", [[]])[0]
            if parts:
                segments = [str(parts[0])]
                if len(parts) > 1:
                    segments.append(str(parts[1]).zfill(2))
                if len(parts) > 2:
                    segments.append(str(parts[2]).zfill(2))
                return "-".join(segments)
        return ""
    except Exception:
        return ""


def parse_date_str(date_str: str) -> tuple[str, str]:
    """date_str から (year, publishedDate) を返す。publishedDate は 'YYYY-MM-DD' 等。"""
    if not date_str:
        return "", ""
    m = re.match(r"(\d{4})[/\-](\d{1,2})(?:[/\-](\d{1,2}))?", date_str)
    if m:
        y = m.group(1)
        mo = m.group(2).zfill(2)
        dy = m.group(3)
        pub_date = f"{y}-{mo}" + (f"-{dy.zfill(2)}" if dy else "")
        return y, pub_date
    m2 = re.search(r"\d{4}", date_str)
    return (m2.group() if m2 else ""), ""


def scrape_doi(doi: str) -> Optional[dict]:
    url = f"https://doi.org/{doi}"
    print(f"  GET {url}", end=" ... ", flush=True)
    try:
        html = fetch_html(url)
    except Exception as e:
        print(f"ERROR: {e}")
        return None

    p = MetaParser()
    p.feed(html)

    title = p.get("citation_title", "dc.title", "og:title", "twitter:title")
    if not title:
        print("SKIP (no title found)")
        return None

    # 著者: citation_author が複数エントリになることが多い
    raw_authors = p.get_all("citation_author", "dc.creator")
    # institution などの長い文字列は除外
    authors = ", ".join(
        a for a in raw_authors
        if len(a) < 100 and "@" not in a and "Correspondence" not in a
    )

    journal = p.get("citation_journal_title", "og:site_name", "dc.source")
    # dc.source は "Soft Sci. 2026, 6, 7." のような形式のことがある → 雑誌名だけ抽出
    if journal and re.search(r"\d{4}", journal):
        journal = p.get("citation_journal_title", "og:site_name") or journal

    date_str = p.get("citation_publication_date", "citation_online_date",
                      "prism.publicationDate", "dc.date")
    year, published_date = parse_date_str(date_str)

    result = {
        "doi":           doi,
        "title":         title,
        "authors":       authors,
        "journal":       journal,
        "year":          year,
        "publishedDate": published_date,
        "citedByCount":  0,
    }
    print("OK")
    return result


def main():
    # 既存JSONを読み込む
    existing: list[dict] = []
    if JSON.exists():
        try:
            existing = json.loads(JSON.read_text(encoding="utf-8"))
        except Exception:
            existing = []
    existing_dois = {e["doi"] for e in existing}

    # manualcurated.txt を読む
    if not TXT.exists():
        print(f"ERROR: {TXT} not found")
        sys.exit(1)
    dois = [
        line.strip().removeprefix("https://doi.org/").removeprefix("http://doi.org/")
        for line in TXT.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    print(f"{len(dois)} DOI(s) in manualcurated.txt")

    added = 0
    for doi in dois:
        if doi in existing_dois:
            print(f"  SKIP {doi} (already in JSON)")
            continue
        time.sleep(1)  # 連続アクセスを避ける
        paper = scrape_doi(doi)
        if paper:
            existing.append(paper)
            existing_dois.add(doi)
            added += 1

    # publishedDate が未設定のエントリを CrossRef で補完
    enriched = 0
    for paper in existing:
        if not paper.get("publishedDate"):
            print(f"  CrossRef date: {paper['doi']}", end=" ... ", flush=True)
            time.sleep(0.5)
            date = fetch_crossref_date(paper["doi"])
            if date:
                paper["publishedDate"] = date
                # year も未設定なら先頭4桁を使う
                if not paper.get("year"):
                    paper["year"] = date[:4]
                print(date)
                enriched += 1
            else:
                print("not found")
    if enriched:
        print(f"{enriched} entry(ies) enriched with publishedDate")

    # publishedDate → year の降順でソート
    def sort_key(x):
        return x.get("publishedDate") or x.get("year", "") or ""

    existing.sort(key=sort_key, reverse=True)

    JSON.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    print(f"\n{added} paper(s) added → {JSON}")


if __name__ == "__main__":
    main()
