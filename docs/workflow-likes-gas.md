# 動画でワークフロー — いいね（Google シート連携）セットアップ手順

`pages/workflow-*.vue` と一覧 `pages/workflows.vue` の「いいね」の件数を、Google スプレッドシートに保存して
全員で共有するための手順です。書き込み口として **Google Apps Script (GAS) の Web App** を使います
（ブロックくずしのランキング `docs/blocks-ranking-gas.md` と同じ仕組みです）。

## 全体像

```
ブラウザ ──GET  ?action=list──────────▶ GAS Web App ──▶ Google シート(読み)
        └─POST {"id"}─────────────▶ GAS Web App ──▶ Google シート(件数を +1)
```

- フロント側は `assets/js/workflowLikes.js` 冒頭の `LIKES_ENDPOINT` に Web App の URL を入れるだけ。
- **誰が押したかは記録しません。** 押された回数をそのまま数えるだけで、ユーザー情報（IP、ID、
  ブラウザ内の記録など）は一切収集しません。取り消しもなく、押すたびに +1 されます。
  連打を和らげるため、ボタンは押してから 1.5 秒間は押せません。
  ただし一覧ページの「動画でワークフロー」全体へのいいね（ID: `workflow-all`）は、何回でも押せます。
  件数は押すたびにすぐ増え、10 秒ごとに取り直してほかの人が押した分も反映します。
- 空のあいだは件数を表示しません（押してもどこにも保存されません）。
  一覧の「いいね順」は、全件 0 として標準の並びのままになります。
- いいねの ID はページのパスから作ります（`/workflow-variant.html` → `workflow-variant`）。
  新しいワークフローを追加しても、GAS 側の設定は不要です。

## 手順

### 1. スプレッドシートを用意
1. 新規スプレッドシートを作成（例: `togotv-workflow-likes`）。
2. 1 行目に見出しを入れる：`id` / `count` / `updated`

### 2. Apps Script を紐付け
スプレッドシートのメニュー **拡張機能 → Apps Script** を開き、以下を貼り付けて保存。

```javascript
const SHEET_NAME = 'シート1'; // 実際のシート名に合わせる
const ID_PATTERN = /^workflow-[a-z0-9-]{1,60}$/;

function _sheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// 列: 0 id / 1 count / 2 updated

// GET ?action=list → { ok: true, counts: { "workflow-variant": 12, ... } }
function doGet(e) {
  const rows = _sheet().getDataRange().getValues().slice(1);
  const counts = {};
  rows.forEach(function (r) {
    if (ID_PATTERN.test(String(r[0]))) counts[r[0]] = Number(r[1]) || 0;
  });
  return _json({ ok: true, counts: counts });
}

// POST {"id": "workflow-variant"} → 件数を +1 して { ok: true, count: 13 }
// 送られてくるのは ID だけ。誰が押したかは受け取らないし記録もしない。
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return _json({ ok: false, error: 'bad json' });
  }
  const id = String(data.id || '');
  if (!ID_PATTERN.test(id)) {
    return _json({ ok: false, error: 'invalid' });
  }

  // 同時に押されても件数がずれないように排他する
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = _sheet();
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === id) {
        const count = (Number(values[i][1]) || 0) + 1;
        sheet.getRange(i + 1, 2, 1, 2).setValues([[count, new Date()]]);
        return _json({ ok: true, count: count });
      }
    }
    const count = 1;
    sheet.appendRow([id, count, new Date()]);
    return _json({ ok: true, count: count });
  } finally {
    lock.releaseLock();
  }
}
```

### 3. Web App としてデプロイ
1. Apps Script 画面右上の **デプロイ → 新しいデプロイ**。
2. 種類：**ウェブアプリ**。
3. **次のユーザーとして実行**：自分（自分のアカウント）。
4. **アクセスできるユーザー**：**全員**（匿名を含む）。
5. デプロイして表示される `https://script.google.com/macros/s/XXXX/exec` の URL をコピー。

### 4. フロントに URL を設定
`assets/js/workflowLikes.js` の `LIKES_ENDPOINT` に URL を貼り付けて commit / push します。

```js
export const LIKES_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
```

### 5. 動作確認
- ブラウザで `LIKES_ENDPOINT?action=list` を開き、`{"ok":true,"counts":{}}` が返ること。
- ワークフローページでいいねを押すと、シートに `id` の行が追加され `count` が増えること。
- 一覧ページで「いいね順」を選ぶと、件数の多い順に並ぶこと。

## 注意点

- **URL は公開情報になります**（このリポジトリは PUBLIC で、ブラウザからも見えます）。
  件数を書き換えられるのは「+1 ずつ」「`workflow-` で始まる ID のみ」に限定していますが、
  ユーザーを区別しない仕様なので、同じ人が何度押しても（直接 POST しても）その分だけ増えます。
  いいねは目安の数字として扱ってください。
- 不正に増えた場合は、シートの `count` を直接書き換えれば反映されます。
- スクリプトを編集したときは **デプロイを管理 → 編集 → 新バージョン** で更新します
  （新しいデプロイを作ると URL が変わるので、その場合は `LIKES_ENDPOINT` も更新が必要）。
- 一覧の「いいね順」は、ページを開いた時点の件数で並べます。いいねを押した直後にカードが動くことはありません。
