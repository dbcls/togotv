# Togo Picture block-kuzushi — スコアランキング（Google シート連携）セットアップ手順

`pages/pics-blocks.vue` のスコアランキングを、Google スプレッドシートに保存して
全プレイヤーで共有するための手順です。書き込み口として **Google Apps Script (GAS) の Web App** を使います。

## 全体像

```
ブラウザ(ゲーム) ──GET  ?action=list──▶ GAS Web App ──▶ Google シート(読み)
                └─POST JSON(スコア)──▶ GAS Web App ──▶ Google シート(追記)
```

- ゲーム側は `RANKING_ENDPOINT`（`pages/pics-blocks.vue` 冒頭の定数）に Web App の URL を入れるだけ。
- 空のあいだは **localStorage のみ**で動作（共有ランキングは無効、その端末内だけ）。

## 手順

### 1. スプレッドシートを用意
1. 新規スプレッドシートを作成（名前は任意、例: `togo-blocks-ranking`）。
2. 1 行目に見出しを入れる：`date` / `name` / `score` / `level` / `lines` / `email`
   （`email` は賞品連絡用。**公開の一覧APIには出さない**ので、シート内だけに保管されます）

### 2. Apps Script を紐付け
スプレッドシートのメニュー **拡張機能 → Apps Script** を開き、以下を貼り付けて保存。

```javascript
const SHEET_NAME = 'シート1'; // 実際のシート名に合わせる
const MAX_ROWS = 500;         // 保持する最大件数(古いものから間引く)

function _sheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET ?action=list → 上位を返す（email は返さない = 公開しない）
function doGet(e) {
  const sheet = _sheet();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1); // ヘッダー除去
  const list = rows.map(function (r) {
    // 注意: r[5](email)は含めない。公開一覧に連絡先を出さないため。
    return { date: r[0], name: r[1], score: Number(r[2]) || 0, level: r[3], lines: r[4] };
  });
  list.sort(function (a, b) { return b.score - a.score; });
  return _json(list.slice(0, 20));
}

// POST(JSON body) → 1件追記
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const name = String(data.name || '名無し').slice(0, 40);
  const score = Number(data.score) || 0;
  const level = Number(data.level) || 0;
  const lines = Number(data.lines) || 0;
  const email = String(data.email || '').slice(0, 120); // 賞品連絡用(シート内のみ)
  const date = data.date || new Date().toISOString();

  const sheet = _sheet();
  sheet.appendRow([date, name, score, level, lines, email]);

  // 件数が多くなりすぎたら、スコア下位から間引く（任意）
  const last = sheet.getLastRow();
  if (last - 1 > MAX_ROWS) {
    // ここでは単純に古い行を消す実装は省略。必要なら別途整理。
  }
  return _json({ ok: true });
}
```

### 3. Web App としてデプロイ
1. Apps Script 画面右上の **デプロイ → 新しいデプロイ**。
2. 種類：**ウェブアプリ**。
3. **次のユーザーとして実行**：自分（自分のアカウント）。
4. **アクセスできるユーザー**：**全員**（匿名を含む）。
5. デプロイして表示される `https://script.google.com/macros/s/XXXX/exec` の URL をコピー。

> スコアはブラウザ側から送るため、URL は公開情報になります（このリポジトリは PUBLIC）。
> 秘密情報ではないので URL の露出自体は問題ありませんが、**誰でも書き込める**点は
> ゲームのランキングとして許容できる範囲か確認してください（クライアント送信なので
> スコアの厳密な改ざん防止はできません＝カジュアルなランキング用途向け）。

### 4. ゲーム側に URL を設定
`pages/pics-blocks.vue` の先頭付近：

```javascript
const RANKING_ENDPOINT = 'https://script.google.com/macros/s/XXXX/exec'
```

に貼り付けて保存。以降、ゲームオーバー画面の「ランキングに登録」でシートへ書き込まれ、
ページ読み込み時に共有ランキングが表示されます。

## 注意
- **CORS**：GET はそのまま、POST は `Content-Type: text/plain` で送っています（GAS の
  プリフライト回避の定番）。ゲーム側は実装済みなので変更不要です。
- コードを更新したら **デプロイ → デプロイを管理 → 既存デプロイを編集 → バージョンを新規** で
  反映してください（URL は変わりません）。
