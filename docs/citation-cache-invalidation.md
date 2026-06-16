# 文献キャッシュの自動無効化の仕組み

## 背景

`citations.vue` はEuropePMC・CrossRef・manualcurated_data.json から文献データを取得する。
毎回APIを叩くと遅いため、取得結果をlocalStorageに7日間キャッシュしている。

**問題**: `manualcurated_data.json` を更新してpushしても、ユーザーのブラウザには
7日間キャッシュが残り続けるため、新しい文献が表示されない。

## 解決策: コンテンツハッシュによるキャッシュ無効化

### アイデア

「JSONのファイルを取得して内容が変わっていたらキャッシュを捨てる」という仕組み。
`manualcurated_data.json` は軽量（数KB）なので毎回フェッチしても問題ない。

### 実装フロー

```
1. ページを開く
   ↓
2. manualcurated_data.json を取得 → JSON.stringify() でハッシュ文字列を生成
   ↓
3. localStorageのキャッシュを確認
   ├─ キャッシュなし or 7日以上経過          → フル再取得 (4へ)
   ├─ ハッシュが前回と異なる（JSON更新あり）  → キャッシュ破棄してフル再取得 (4へ)
   └─ ハッシュが同じ & 7日以内              → キャッシュをそのまま表示して終了
   ↓
4. EuropePMC / CrossRef / manualcurated.txt からフル取得
   ↓
5. manualcurated_data.json の内容もマージ（手順2で取得済みのものを再利用）
   ↓
6. 結果 + manualHash をlocalStorageに保存
```

### キャッシュの保存形式

```json
{
  "timestamp": 1749600000000,
  "data": [ ...文献データ配列... ],
  "manualHash": "[{\"doi\":\"10.20517/ss.2025.107\",...}]"
}
```

`manualHash` は `JSON.stringify(manualcurated_data.json の中身)` の文字列そのもの。
暗号学的なハッシュ関数は使わず、文字列比較だけで更新検知できる。

### ポイント

- `manualcurated_data.json` を「番兵ファイル」として使う。
  このファイルが変われば必ずキャッシュが破棄される。
- EuropePMC/CrossRefのデータは変わっても再取得されない（7日キャッシュ）が、
  手動キュレートデータは即座に反映される。
- `manualcurated_data.json` のフェッチはキャッシュチェックより**前**に行うのがポイント。
  後で取得しようとすると、キャッシュがヒットした場合にそこでreturnしてしまう。

## 関連ファイル

| ファイル | 役割 |
|---|---|
| `static/citations/manualcurated.txt` | APIで取れない論文のDOIリスト（1行1DOI） |
| `static/citations/manualcurated_data.json` | スクレイピング済みの文献メタデータ（番兵ファイル兼データ） |
| `scripts/fetch_manual_citations.py` | DOIページをスクレイピングしてJSONを生成するスクリプト |
| `pages/citations.vue` | 上記の仕組みを実装している文献一覧ページ |

## 運用手順

1. `static/citations/manualcurated.txt` に取得できないDOIを1行追記
2. `python3 scripts/fetch_manual_citations.py` を実行
3. `static/citations/manualcurated_data.json` が更新される
4. `git add` してpush
5. Actions完了後、ユーザーが次にページを開いた時点でキャッシュが自動破棄されて新データが表示される
