# TogoTV 文献リスト 手動追加ガイド

TogoTVの文献ページ（`/citations.html`）は、複数のAPIを組み合わせて論文情報を自動収集しています。しかし、APIに登録されていない論文は自動では取得できません。このドキュメントでは、漏れている論文を手動で補完する方法を説明します。

---

## 1. 自動収集の仕組み（現状）

`pages/citations.vue` が以下の3つのソースから論文データを収集しています。

| ソース | クエリ内容 | 得意とする文献 |
|---|---|---|
| EuropePMC | `"TogoTV"` または `"Togo picture gallery"` | PubMed/PMC 収録の英語論文 |
| OpenCitations | 原著論文 DOI `10.1093/bib/bbr039` の被引用文献 | 上記原著を直接引用した論文 |
| `manualcurated_data.json` | 手動登録済みのメタデータ | 上記で取得できないすべての論文 |

EuropePMC に収録されていない論文、またはTogoTVへの言及が本文中にない論文は**自動収集の対象外**になります。

---

## 2. 漏れやすい文献の種類

DBCLSの引用文献リスト（https://dbcls.rois.ac.jp/references.html#TogoTV）を2026年6月時点で照合したところ、以下のカテゴリが EuropePMC に未登録で漏れていました。

### 2-1. 日本語学術誌

日本語誌の多くは EuropePMC に収録されていません。

- `10.11234/jsbibr.2023.2` — 日本生物情報科学会誌
- `10.11234/jsbibr.2023.primer1` — 同上
- `10.11234/jsbibr.2022.primer3` — 同上
- `10.18960/hozen.2128` — 保全生態学研究
- `10.1537/ase.2011302` — Anthropological Science
- `10.14889/jpdm.2020.0005` — 日本計算質量分析学会誌
- `10.7887/jcns.27.752` — 脳神経外科ジャーナル

### 2-2. 書籍チャプター（Springer など）

書籍やプロシーディングスのチャプターは EuropePMC に登録されないことが多いです。

- `10.1007/978-981-99-1079-3_1`
- `10.1007/978-3-031-21820-0_4`
- `10.1007/978-3-031-08045-6_28`

### 2-3. 学会発表録（IEEE など）

- `10.1109/ICALT.2016.40` — IEEE ICALT 2016

### 2-4. スクレイピングが blocked される出版社

以下の出版社は DOI ページへの直接アクセスが 403 Forbidden になります。ただし **CrossRef API では取得可能**なので、スクリプトが失敗しても後述の CrossRef 補完手順で対応できます。

- **MDPI** (`10.3390/…`)
- **Elsevier** (`10.1016/…` の一部)

---

## 3. 手順：不足している論文を追加する

### Step 1 — DOI を確認する

https://dbcls.rois.ac.jp/references.html#TogoTV を開き、現在の `manualcurated.txt` に含まれていない DOI を探します。

または下記スクリプトで EuropePMC に未収録の DOI をまとめて抽出することもできます（応用例として参考にしてください）。

### Step 2 — `manualcurated.txt` に追記する

```
static/citations/manualcurated.txt
```

1行1DOIの形式で追記します。`https://doi.org/` プレフィックスがついていても、ついていなくても構いません。

```
10.1234/example.doi
https://doi.org/10.5678/another.doi  # どちらでも OK
```

### Step 3 — スクリプトを実行してメタデータを取得する

```bash
python3 scripts/fetch_manual_citations.py
```

- すでに `manualcurated_data.json` に存在する DOI は自動でスキップされます
- DOI ページをスクレイピングして、タイトル・著者・雑誌名・出版年を取得します
- 取得できた場合 `OK`、失敗した場合 `ERROR:` と表示されます

#### 403 が出た場合（MDPI・Elsevier など）

スクリプトがエラーで終了した DOI は JSON に追加されません。以下のように CrossRef API で補完してください。

```python
import urllib.request, urllib.parse, json

doi = "10.1016/j.example.2023.999999"  # 対象 DOI
url = "https://api.crossref.org/works/" + urllib.parse.quote(doi)
req = urllib.request.Request(url, headers={"User-Agent": "MyApp/1.0 (mailto:yourname@example.com)"})
with urllib.request.urlopen(req, timeout=15) as r:
    msg = json.loads(r.read())["message"]

print("Title:", msg.get("title", [""])[0])
print("Year:", (msg.get("published") or {}).get("date-parts", [[""]])[0][0])
```

取得できたら、`manualcurated_data.json` を直接編集して追記します（JSONの配列に1オブジェクト追加）。

### Step 4 — 動作確認

```bash
python3 -c "
import json
data = json.loads(open('static/citations/manualcurated_data.json').read())
print(f'Total: {len(data)} entries')
for p in data:
    print(p['year'], '|', p['doi'][:40], '|', p['title'][:50])
"
```

### Step 5 — コミット・プッシュ

```bash
git add static/citations/manualcurated.txt static/citations/manualcurated_data.json
git commit -m "Add missing citations to manualcurated"
git push
```

---

## 4. キャッシュの自動無効化について

`manualcurated_data.json` が更新されると、次回ユーザーが `/citations.html` を開いたときにブラウザの localStorage キャッシュ（7日間）が**自動的に破棄**され、新しいデータが表示されます。

詳細は [`docs/citation-cache-invalidation.md`](./citation-cache-invalidation.md) を参照してください。

---

## 5. ファイル構成まとめ

| ファイル | 役割 |
|---|---|
| `static/citations/manualcurated.txt` | 追加したい論文の DOI 一覧（1行1DOI） |
| `static/citations/manualcurated_data.json` | スクレイピング済みメタデータ（サイトが配信する静的ファイル） |
| `scripts/fetch_manual_citations.py` | DOIページをスクレイピングして JSON を更新するスクリプト |
| `pages/citations.vue` | 文献ページ本体（3ソースを統合して表示） |
| `docs/citation-cache-invalidation.md` | キャッシュ無効化の仕組みの解説 |

---

## 6. 定期的な確認のすすめ

DBCLSの引用文献リストは随時更新されます。半年〜1年に1回程度、以下を確認することをおすすめします。

1. https://dbcls.rois.ac.jp/references.html#TogoTV を開き、件数を確認
2. 現在の `manualcurated.txt` に含まれていない DOI があれば Step 2〜5 を実施
3. EuropePMC に収録されているかどうか不明な場合は、EuropePMC の DOI 検索（`https://europepmc.org/search?query=DOI:10.xxxx/xxxx`）で確認

EuropePMC に収録されていれば、TogoTV への言及が本文にある限り自動収集されます。収録されていない場合は `manualcurated.txt` への追加が必要です。
