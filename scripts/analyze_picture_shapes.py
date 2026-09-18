#!/usr/bin/env python3
"""
Togo picture gallery の全画像について、PNGヘッダーだけを読んで
(フル画像をダウンロードせず) 幅/高さのアスペクト比を集計し、
pics-blocks.vue と同じ閾値でブロック種別ごとの件数を出す。

使い方:
    python3 scripts/analyze_picture_shapes.py
"""

import json
import urllib.request
import urllib.error
import time
from concurrent.futures import ThreadPoolExecutor

API_ENTRIES = "https://togotv-api.dbcls.jp/api/entries"
IMAGE_BASE = "https://dbarchive.biosciencedbc.jp/data/togo-pic/image/"
ROWS = 100
HEADERS = {"User-Agent": "TogoTV-shape-analysis/1.0"}


def classify_shape(ratio):
    if ratio is None:
        return "?"
    if ratio < 0.45:
        return "I"
    if ratio < 0.6:
        return "L"
    if ratio < 0.85:
        return "S"
    if ratio <= 1.18:
        return "O"
    if ratio <= 1.4:
        return "T"
    if ratio <= 1.8:
        return "Z"
    if ratio <= 2.2:
        return "J"
    return "I"


def fetch_page(page):
    url = f"{API_ENTRIES}?target=pictures&from={page}&rows={ROWS}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))


def png_dims(filename):
    """PNGファイルの先頭33バイトだけRangeリクエストで取得しIHDRからwidth/heightを読む"""
    url = IMAGE_BASE + filename
    req = urllib.request.Request(url, headers={**HEADERS, "Range": "bytes=0-32"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
    except Exception:
        return None
    if len(data) < 24 or data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    width = int.from_bytes(data[16:20], "big")
    height = int.from_bytes(data[20:24], "big")
    if height == 0:
        return None
    return width, height


def main():
    first = fetch_page(1)
    numfound = first.get("numfound", 0)
    last_page = first.get("last_page", 1)
    print(f"numfound={numfound}  (rows={ROWS} -> last_page={last_page})")

    counts = {k: 0 for k in ["I", "O", "T", "S", "Z", "J", "L", "?"]}
    examples = {k: [] for k in counts}
    total_checked = 0
    page_data = first["data"]
    page = 1

    def process(item):
        png = item.get("png")
        if not png or png == "-":
            return None
        dims = png_dims(png)
        ratio = (dims[0] / dims[1]) if dims else None
        shape = classify_shape(ratio)
        name = item.get("name") or item.get("name_en") or png
        return shape, name, ratio

    while True:
        with ThreadPoolExecutor(max_workers=20) as ex:
            results = list(ex.map(process, page_data))
        for res in results:
            if res is None:
                continue
            shape, name, ratio = res
            counts[shape] += 1
            if len(examples[shape]) < 3:
                examples[shape].append((name, round(ratio, 2) if ratio else None))
            total_checked += 1
        print(f"  page {page}/{last_page}  checked so far: {total_checked}")
        if page >= last_page:
            break
        page += 1
        time.sleep(0.05)
        try:
            page_data = fetch_page(page)["data"]
        except Exception as e:
            print(f"  page {page} fetch error: {e}")
            break

    print("\n=== 集計結果 ===")
    for shape in ["I", "O", "T", "S", "Z", "J", "L", "?"]:
        n = counts[shape]
        pct = (n / total_checked * 100) if total_checked else 0
        ex = ", ".join(f"{name}({r})" for name, r in examples[shape])
        print(f"  {shape}: {n:5d}  ({pct:5.1f}%)   例: {ex}")
    print(f"\n合計チェック数: {total_checked}")


if __name__ == "__main__":
    main()
